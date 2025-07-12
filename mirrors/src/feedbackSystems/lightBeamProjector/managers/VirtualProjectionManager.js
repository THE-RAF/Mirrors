/**
 * @file VirtualProjectionManager.js - Manages virtual light beam projections
 * Handles creation, updating, and cleanup of virtual projections from polygons to viewer
 */

import { VirtualLightBeam } from '../../../basicEntities/virtual/VirtualLightBeam.js';
import { calculateVirtualProjectionPath } from '../geometry/ProjectionGeometry.js';

/**
 * @class VirtualProjectionManager
 * Manages virtual projections with polygon-specific state tracking
 */
export class VirtualProjectionManager {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG canvas for rendering
     * @param {Object} config.beamConfig - Virtual beam configuration
     */
    constructor({ svgCanvas, beamConfig }) {
        this.svgCanvas = svgCanvas;
        this.beamConfig = beamConfig;
        // Map: virtualPolygon -> projection object
        this.projectionsByPolygon = new Map();
    }

    /**
     * Create virtual projection for a polygon
     * @param {Object} config
     * @param {Object} config.virtualPolygon - The virtual polygon
     * @param {Object} config.viewer - The viewer object
     * @returns {Object} Created projection
     */
    createProjection({ virtualPolygon, viewer }) {
        const pathData = calculateVirtualProjectionPath({ virtualPolygon, viewer });
        
        const projection = new VirtualLightBeam({
            emissionPoint: pathData.emissionPoint,
            directorVector: pathData.direction,
            maxLength: pathData.length,
            strokeColor: this.beamConfig.color,
            strokeWidth: this.beamConfig.strokeWidth,
            animated: true,
            animationDuration: this.beamConfig.animationDuration,
            parentSvg: this.svgCanvas
        });

        projection.sourceVirtualPolygon = virtualPolygon;
        this.projectionsByPolygon.set(virtualPolygon, projection);
        
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

        const pathData = calculateVirtualProjectionPath({ virtualPolygon, viewer });
        
        projection.emissionPoint = pathData.emissionPoint;
        projection.directorVector = pathData.direction;
        projection.maxLength = pathData.length;
        projection.points = [pathData.emissionPoint, pathData.endpoint];
        projection.updateBeamPath();
        
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

        projection.destroy();
        this.projectionsByPolygon.delete(virtualPolygon);
        return true;
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
            projection.destroy();
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
