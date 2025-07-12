/**
 * @file LightBeamProjector.js - Modular light beam projection system
 * Coordinates virtual and real projection managers with clean separation of concerns
 * 
 * Terminology:
 * - Virtual Projection: Light beam projected from a virtual polygon to the viewer
 * - Real Projection: Light beam projected from a real polygon through mirrors to the viewer
 * - Projections: Specific light beams that connect polygons to the viewer
 */

import { VirtualProjectionManager } from './managers/VirtualProjectionManager.js';
import { RealProjectionManager } from './managers/RealProjectionManager.js';
import { validateProjectionEndpoint, calculateRealProjectionPath } from './geometry/ProjectionGeometry.js';

/**
 * @class LightBeamProjector
 * Main coordinator for the modular projection system
 * Delegates specific responsibilities to specialized managers
 */
export class LightBeamProjector {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG canvas for rendering beams
     * @param {Object} config.viewer - The single viewer object
     * @param {Object} config.lightBeamEngine - Light beam engine for creating real light beams
     * @param {Array} config.mirrors - Array of mirror objects for beam reflections
     * @param {Object} config.beamConfig - Beam appearance and behavior configuration
     */
    constructor({ svgCanvas, viewer, lightBeamEngine, mirrors, beamConfig }) {
        this.viewer = viewer;
        this.lightBeamEngine = lightBeamEngine;
        this.mirrors = mirrors;
        
        // Initialize beam configuration with defaults
        this.beamConfig = this.initializeBeamConfig(beamConfig);
        
        // Create specialized managers
        this.virtualManager = new VirtualProjectionManager({
            svgCanvas,
            beamConfig: this.beamConfig.virtualBeam
        });
        
        this.realManager = new RealProjectionManager({
            lightBeamEngine,
            mirrors,
            beamConfig: this.beamConfig.realBeam
        });
        
        // Event handlers for external communication (optional)
        this.eventHandlers = {
            onProjectionCreated: null,
            onProjectionRemoved: null,
            onProjectionUpdated: null
        };
    }

    /**
     * Initialize beam configuration with defaults
     * @param {Object|undefined} beamConfig - User-provided beam configuration
     * @returns {Object} Complete beam configuration with defaults
     */
    initializeBeamConfig(beamConfig) {
        return {
            virtualBeam: {
                color: beamConfig?.virtualBeam?.color || '#fa6c00',
                strokeWidth: beamConfig?.virtualBeam?.strokeWidth || 2,
                animationDuration: beamConfig?.virtualBeam?.animationDuration || 1000,
                tolerance: beamConfig?.virtualBeam?.tolerance || 10
            },
            realBeam: {
                color: beamConfig?.realBeam?.color || '#ffdd00',
                strokeWidth: beamConfig?.realBeam?.strokeWidth || 2,
                animationDuration: beamConfig?.realBeam?.animationDuration || 1000
            }
        };
    }

    // ============================================
    // PUBLIC INTERFACE
    // ============================================

    /**
     * Handle virtual polygon click events with toggle functionality
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    handleVirtualPolygonClick({ virtualPolygon }) {
        if (!this.viewer) return;

        // Check if projection is valid before creating
        if (!this.isValidProjection({ virtualPolygon })) {
            return;
        }

        // Toggle projections for this specific polygon
        const wasActive = this.hasProjections({ virtualPolygon });
        
        if (wasActive) {
            // Remove projections
            this.removeProjections({ virtualPolygon });
            this.triggerEvent({ eventName: 'onProjectionRemoved', data: { virtualPolygon } });
        } else {
            // Create projections
            this.createProjections({ virtualPolygon });
            this.triggerEvent({ eventName: 'onProjectionCreated', data: { virtualPolygon } });
        }
    }

    /**
     * Create both virtual and real projections for a polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {Object} Created projections { virtual, real }
     */
    createProjections({ virtualPolygon }) {
        const virtualProjection = this.virtualManager.createProjection({ virtualPolygon, viewer: this.viewer });
        const realProjection = this.realManager.createProjection({ virtualPolygon, viewer: this.viewer });
        
        return {
            virtual: virtualProjection,
            real: realProjection
        };
    }

    /**
     * Remove both virtual and real projections for a polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {Object} Removal results { virtual, real }
     */
    removeProjections({ virtualPolygon }) {
        const virtualRemoved = this.virtualManager.removeProjection({ virtualPolygon });
        const realRemoved = this.realManager.removeProjection({ virtualPolygon });
        
        return {
            virtual: virtualRemoved,
            real: realRemoved
        };
    }

    /**
     * Update all active projections when scene elements are dragged
     * Removes projections that are no longer valid after changes
     */
    updateAllProjections() {
        if (!this.viewer) return;

        // Get all active polygons (use virtual manager as authoritative source)
        const activePolygons = this.virtualManager.getActivePolygons();
        
        for (const virtualPolygon of activePolygons) {
            if (this.isValidProjection({ virtualPolygon })) {
                // Update both virtual and real projections
                this.virtualManager.updateProjection({ virtualPolygon, viewer: this.viewer });
                this.realManager.updateProjection({ virtualPolygon, viewer: this.viewer });
                this.triggerEvent({ eventName: 'onProjectionUpdated', data: { virtualPolygon } });
            } else {
                // Remove invalid projections
                this.removeProjections({ virtualPolygon });
                this.triggerEvent({ eventName: 'onProjectionRemoved', data: { virtualPolygon } });
            }
        }
    }

    /**
     * Check if a polygon has active projections
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if polygon has projections
     */
    hasProjections({ virtualPolygon }) {
        return this.virtualManager.hasProjection({ virtualPolygon }) || 
               this.realManager.hasProjection({ virtualPolygon });
    }

    /**
     * Clear all projections
     */
    clearAllProjections() {
        this.virtualManager.clearAll();
        this.realManager.clearAll();
    }

    /**
     * Get projection statistics
     * @returns {Object} Statistics about active projections
     */
    getProjectionStats() {
        return {
            virtualCount: this.virtualManager.getProjectionCount(),
            realCount: this.realManager.getProjectionCount(),
            activePolygons: this.virtualManager.getActivePolygons(),
            totalProjections: this.virtualManager.getProjectionCount() + this.realManager.getProjectionCount()
        };
    }

    // ============================================
    // VALIDATION AND UTILITIES
    // ============================================

    /**
     * Validate if a projection is valid (endpoint reaches viewer)
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if projection is valid
     */
    isValidProjection({ virtualPolygon }) {
        const realPath = calculateRealProjectionPath({
            virtualPolygon,
            viewer: this.viewer,
            lightBeamEngine: this.lightBeamEngine,
            mirrors: this.mirrors
        });
        
        if (!realPath) return false;
        
        return validateProjectionEndpoint({
            projectionPath: realPath,
            viewer: this.viewer,
            lightBeamEngine: this.lightBeamEngine,
            mirrors: this.mirrors,
            tolerance: this.beamConfig.virtualBeam.tolerance
        });
    }

    // ============================================
    // EVENT SYSTEM
    // ============================================

    /**
     * Set event handler for projection lifecycle events
     * @param {Object} config
     * @param {string} config.eventName - Event name (onProjectionCreated, onProjectionRemoved, onProjectionUpdated)
     * @param {Function} config.handler - Event handler function
     */
    setEventHandler({ eventName, handler }) {
        if (this.eventHandlers.hasOwnProperty(eventName)) {
            this.eventHandlers[eventName] = handler;
        }
    }

    /**
     * Trigger an event if handler is set
     * @param {Object} config
     * @param {string} config.eventName - Event name
     * @param {Object} config.data - Event data
     */
    triggerEvent({ eventName, data }) {
        const handler = this.eventHandlers[eventName];
        if (handler && typeof handler === 'function') {
            handler(data);
        }
    }

    // ============================================
    // MANAGER ACCESS (for advanced use cases)
    // ============================================

    /**
     * Get direct access to virtual projection manager
     * @returns {VirtualProjectionManager} Virtual projection manager
     */
    getVirtualManager() {
        return this.virtualManager;
    }

    /**
     * Get direct access to real projection manager
     * @returns {RealProjectionManager} Real projection manager
     */
    getRealManager() {
        return this.realManager;
    }
}
