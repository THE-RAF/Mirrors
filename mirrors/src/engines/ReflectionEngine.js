/**
 * @file ReflectionEngine.js - Manages virtual reflections of real objects
 * Main exports: ReflectionEngine
 */

import { VirtualPolygon } from '../basicEntities/virtual/VirtualPolygon.js';
import { reflectPolygonOverAxis } from '../math/reflections.js';

/**
 * @class ReflectionEngine
 * Handles creation, updating, and management of virtual polygon reflections
 */
export class ReflectionEngine {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual polygons
     */
    constructor({ svgCanvas }) {
        this.svgCanvas = svgCanvas;
        this.virtualPolygons = [];
    }

    /**
     * Create reflections of all polygons across all mirrors
     * @param {Array} polygons - Array of real polygon objects
     * @param {Array} mirrors - Array of mirror objects
     */
    createReflections(polygons, mirrors) {
        polygons.forEach(polygon => {
            mirrors.forEach(mirror => {
                // Define mirror axis from mirror coordinates
                const axis = {
                    x1: mirror.x1,
                    y1: mirror.y1,
                    x2: mirror.x2,
                    y2: mirror.y2
                };
                
                // Reflect polygon vertices
                const reflectedVertices = reflectPolygonOverAxis({
                    polygon: polygon.vertices,
                    axis: axis
                });
                
                // Create virtual polygon for the reflection
                const virtualPolygon = new VirtualPolygon({
                    vertices: reflectedVertices,
                    fill: polygon.fill,
                    parentSvg: this.svgCanvas
                });
                
                this.virtualPolygons.push(virtualPolygon);
            });
        });
    }

    /**
     * Update all reflections based on current polygon and mirror positions
     * @param {Array} polygons - Array of real polygon objects
     * @param {Array} mirrors - Array of mirror objects
     */
    updateReflections(polygons, mirrors) {
        this.clearReflections();
        this.createReflections(polygons, mirrors);
    }

    /**
     * Clear all existing virtual polygon reflections
     */
    clearReflections() {
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualPolygons = [];
    }

    /**
     * Clean up all reflection resources
     */
    destroy() {
        this.clearReflections();
    }
}
