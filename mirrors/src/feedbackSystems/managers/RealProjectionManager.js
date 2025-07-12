/**
 * @file RealProjectionManager.js - Manages real light beam projections through mirrors
 * Handles creation, updating, and cleanup of real projections from polygons through mirrors to viewer
 */

import { calculateRealProjectionPath } from '../geometry/ProjectionGeometry.js';

/**
 * @class RealProjectionManager
 * Manages real projections with polygon-specific state tracking
 */
export class RealProjectionManager {
    /**
     * @param {Object} config
     * @param {Object} config.lightBeamEngine - Light beam engine for creating real beams
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {Object} config.beamConfig - Real beam configuration
     */
    constructor({ lightBeamEngine, mirrors, beamConfig }) {
        this.lightBeamEngine = lightBeamEngine;
        this.mirrors = mirrors;
        this.beamConfig = beamConfig;
        // Map: virtualPolygon -> projection object
        this.projectionsByPolygon = new Map();
    }

    /**
     * Create or toggle real projection for a specific polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @param {Object} config.viewer - The viewer object
     * @returns {Object|null} Created projection or null if toggled off/invalid
     */
    createOrToggleProjection({ virtualPolygon, viewer }) {
        // If projection exists, remove it (toggle off)
        if (this.projectionsByPolygon.has(virtualPolygon)) {
            this.removeProjection({ virtualPolygon });
            return null;
        }

        // Create new projection (toggle on)
        return this.createProjection({ virtualPolygon, viewer });
    }

    /**
     * Create real projection for a polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @param {Object} config.viewer - The viewer object
     * @returns {Object|null} Created projection or null if invalid
     */
    createProjection({ virtualPolygon, viewer }) {
        if (!this.lightBeamEngine) return null;

        const pathData = calculateRealProjectionPath({
            virtualPolygon, 
            viewer, 
            lightBeamEngine: this.lightBeamEngine, 
            mirrors: this.mirrors
        });
        
        if (!pathData) return null;

        const projection = this.lightBeamEngine.createLightBeam({
            emissionPoint: pathData.emissionPoint,
            directorVector: pathData.direction,
            maxLength: pathData.length,
            strokeColor: this.beamConfig.color,
            strokeWidth: this.beamConfig.strokeWidth,
            animated: true,
            animationDuration: this.beamConfig.animationDuration,
            mirrors: this.mirrors
        });

        if (projection) {
            projection.sourceVirtualPolygon = virtualPolygon;
            this.projectionsByPolygon.set(virtualPolygon, projection);
        }
        
        return projection;
    }

    /**
     * Update projection for a specific polygon (when scene changes)
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @param {Object} config.viewer - The viewer object
     * @returns {boolean} True if projection was updated, false if not found
     */
    updateProjection({ virtualPolygon, viewer }) {
        const projection = this.projectionsByPolygon.get(virtualPolygon);
        if (!projection) return false;

        const pathData = calculateRealProjectionPath({
            virtualPolygon, 
            viewer, 
            lightBeamEngine: this.lightBeamEngine, 
            mirrors: this.mirrors
        });
        
        if (!pathData) {
            // Invalid path, remove projection
            this.removeProjection({ virtualPolygon });
            return false;
        }

        // Create temporary beam to get updated reflection points
        const tempProjection = this.lightBeamEngine.createLightBeam({
            emissionPoint: pathData.emissionPoint,
            directorVector: pathData.direction,
            maxLength: pathData.length,
            strokeColor: this.beamConfig.color,
            strokeWidth: this.beamConfig.strokeWidth,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });

        // Update existing projection
        if (tempProjection && tempProjection.points) {
            projection.emissionPoint = pathData.emissionPoint;
            projection.directorVector = pathData.direction;
            projection.maxLength = pathData.length;
            projection.points = [...tempProjection.points];
            projection.updateBeamPath();
        }

        // Cleanup temporary projection
        if (tempProjection && tempProjection.destroy) {
            tempProjection.destroy();
        }

        return true;
    }

    /**
     * Remove projection for a specific polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if projection was removed, false if not found
     */
    removeProjection({ virtualPolygon }) {
        const projection = this.projectionsByPolygon.get(virtualPolygon);
        if (!projection) return false;

        if (projection.destroy) {
            projection.destroy();
        }
        this.projectionsByPolygon.delete(virtualPolygon);
        return true;
    }

    /**
     * Update all active projections (called when scene elements are dragged)
     * @param {Object} config
     * @param {Object} config.viewer - The viewer object
     */
    updateAllProjections({ viewer }) {
        // Convert to array to avoid modification during iteration
        const polygonsToUpdate = Array.from(this.projectionsByPolygon.keys());
        
        for (const virtualPolygon of polygonsToUpdate) {
            this.updateProjection({ virtualPolygon, viewer });
        }
    }

    /**
     * Check if a polygon has an active projection
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if projection exists
     */
    hasProjection({ virtualPolygon }) {
        return this.projectionsByPolygon.has(virtualPolygon);
    }

    /**
     * Get all active projections
     * @returns {Array} Array of projection objects
     */
    getAllProjections() {
        return Array.from(this.projectionsByPolygon.values());
    }

    /**
     * Get all virtual polygons with active projections
     * @returns {Array} Array of virtual polygon objects
     */
    getActivePolygons() {
        return Array.from(this.projectionsByPolygon.keys());
    }

    /**
     * Clear all projections
     */
    clearAll() {
        for (const projection of this.projectionsByPolygon.values()) {
            if (projection && projection.destroy) {
                projection.destroy();
            }
        }
        this.projectionsByPolygon.clear();
    }

    /**
     * Get projection count
     * @returns {number} Number of active projections
     */
    getProjectionCount() {
        return this.projectionsByPolygon.size;
    }
}
