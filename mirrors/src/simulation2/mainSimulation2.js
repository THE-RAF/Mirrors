/**
 * @file mainSimulation2.js - Simplified main simulation
 * Main exports: MainSimulation2
 */

import { Polygon } from '../entities2/real/Polygon.js';

/**
 * @class MainSimulation2
 * Minimal simulation engine for managing polygon objects in SVG
 */
export class MainSimulation2 {
    /**
     * @param {Object} config
     * @param {Object} config.sceneEntities - Scene configuration containing objects
     * @param {SVGElement} config.svgCanvas - SVG element for rendering
     */
    constructor({ sceneEntities, svgCanvas }) {
        this.objectConfigs = sceneEntities.objects || [];
        this.svgCanvas = svgCanvas;
        this.polygons = [];
    }
    
    /**
     * Initialize the simulation environment and create polygons
     */
    init() {
        console.log('MainSimulation2 initialized');
        this.createPolygons();
    }

    /**
     * Create Polygon instances and their SVG elements
     */
    createPolygons() {
        this.polygons = this.objectConfigs.map(objConfig => {
            const polygon = new Polygon({
                vertices: objConfig.vertices,
                fill: objConfig.fill,
                stroke: objConfig.stroke,
                strokeWidth: objConfig.strokeWidth,
                parentSvg: this.svgCanvas
            });
            
            return polygon;
        });
    }
    
    /**
     * Clean up simulation resources and stop all processes
     */
    destroy() {
        // Destroy all polygons
        this.polygons.forEach(polygon => polygon.destroy());
        this.polygons = [];
        console.log('MainSimulation2 destroyed');
    }
}
