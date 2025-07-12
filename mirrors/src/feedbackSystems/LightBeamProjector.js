/**
 * @file LightBeamProjector.js - Compatibility wrapper for the modular projection system
 * Main exports: LightBeamProjector
 * 
 * DEPRECATED: This is a compatibility wrapper. Use ModularLightBeamProjector for new projects.
 * 
 * TERMINOLOGY:
 * - Virtual Projection: Light beam projected from a virtual polygon directly to the viewer
 * - Real Projection: Light beam projected from the real polygon through mirror reflections to the viewer
 * - Projections are the specific light beams that connect polygons to the viewer when clicked
 */

import { ModularLightBeamProjector } from './ModularLightBeamProjector.js';

/**
 * @class LightBeamProjector
 * Compatibility wrapper for ModularLightBeamProjector
 * Maintains the original API while delegating to the new modular system
 * 
 * @deprecated Use ModularLightBeamProjector directly for new projects
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
        // Delegate to the new modular system
        this.modularProjector = new ModularLightBeamProjector({
            svgCanvas,
            viewer,
            lightBeamEngine,
            mirrors,
            beamConfig
        });
        
        // Maintain compatibility properties for legacy code
        this.svgCanvas = svgCanvas;
        this.viewer = viewer;
        this.lightBeamEngine = lightBeamEngine;
        this.mirrors = mirrors;
        this.beamConfig = this.modularProjector.beamConfig;
        
        // Legacy state properties (now computed from modular system)
        this.lastClickedVirtualPolygon = null;
    }

    // ============================================
    // LEGACY COMPATIBILITY INTERFACE
    // ============================================

    /**
     * Handle virtual polygon click events (legacy method)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    handleVirtualPolygonClick({ virtualPolygon }) {
        this.lastClickedVirtualPolygon = virtualPolygon;
        this.modularProjector.handleVirtualPolygonClick({ virtualPolygon });
    }

    /**
     * Cast both real and virtual projections (legacy method)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    castRealAndVirtualProjections({ virtualPolygon }) {
        this.lastClickedVirtualPolygon = virtualPolygon;
        
        if (this.modularProjector.isValidProjection({ virtualPolygon })) {
            this.modularProjector.createProjections({ virtualPolygon });
        }
    }

    /**
     * Update beams (legacy method name)
     */
    updateBeams() {
        this.modularProjector.updateAllProjections();
    }

    /**
     * Clear all beams (legacy method name)
     */
    clearAllBeams() {
        this.modularProjector.clearAllProjections();
        this.lastClickedVirtualPolygon = null;
    }

    // ============================================
    // LEGACY PROPERTY ACCESS
    // ============================================

    /**
     * Get virtual projections (legacy compatibility)
     * @returns {Array} Array of virtual projection objects
     */
    get virtualProjections() {
        return this.modularProjector.getVirtualManager().getAllProjections();
    }

    /**
     * Get real projections (legacy compatibility)
     * @returns {Array} Array of real projection objects
     */
    get realProjections() {
        return this.modularProjector.getRealManager().getAllProjections();
    }

    // ============================================
    // NEW METHODS (pass-through to modular system)
    // ============================================

    /**
     * Update all projections (new method name)
     */
    updateAllProjections() {
        this.modularProjector.updateAllProjections();
    }

    /**
     * Clear all projections (new method name)
     */
    clearAllProjections() {
        this.modularProjector.clearAllProjections();
        this.lastClickedVirtualPolygon = null;
    }

    /**
     * Check if projections exist for a polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if projections exist
     */
    hasProjections({ virtualPolygon }) {
        return this.modularProjector.hasProjections({ virtualPolygon });
    }

    /**
     * Get projection statistics
     * @returns {Object} Projection statistics
     */
    getProjectionStats() {
        return this.modularProjector.getProjectionStats();
    }

    /**
     * Access the underlying modular projector
     * @returns {ModularLightBeamProjector} The modular projector instance
     */
    getModularProjector() {
        return this.modularProjector;
    }

    // ============================================
    // LEGACY METHODS (maintained for compatibility but deprecated)
    // ============================================

    castVirtualProjection({ virtualPolygon }) {
        console.warn('castVirtualProjection is deprecated. Use createProjections() instead.');
        this.modularProjector.getVirtualManager().createProjection({ virtualPolygon, viewer: this.viewer });
    }

    castRealProjection({ virtualPolygon }) {
        console.warn('castRealProjection is deprecated. Use createProjections() instead.');
        this.modularProjector.getRealManager().createProjection({ virtualPolygon, viewer: this.viewer });
    }

    clearVirtualProjections() {
        console.warn('clearVirtualProjections is deprecated. Use clearAllProjections() instead.');
        this.modularProjector.getVirtualManager().clearAll();
    }

    clearRealBeams() {
        console.warn('clearRealBeams is deprecated. Use clearAllProjections() instead.');
        this.modularProjector.getRealManager().clearAll();
    }

    isProjectionEndpointAtViewer({ virtualPolygon }) {
        console.warn('isProjectionEndpointAtViewer is deprecated. Use modular system validation.');
        return this.modularProjector.isValidProjection({ virtualPolygon });
    }
}
