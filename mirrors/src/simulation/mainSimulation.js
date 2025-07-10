/**
 * @file mainSimulation.js - Simplified main simulation
 * Main exports: MainSimulation
 */

import { Polygon } from '../entities/real/Polygon.js';
import { Mirror } from '../entities/real/Mirror.js';

/**
 * @class MainSimulation
 * Minimal simulation engine for managing polygon objects in SVG
 */
export class MainSimulation {
    /**
     * @param {Object} config
     * @param {Object} config.sceneEntities - Scene configuration containing objects
     * @param {SVGElement} config.svgCanvas - SVG element for rendering
     * @param {Object} config.generalConfig - General application configuration
     */
    constructor({ sceneEntities, generalConfig, svgCanvas }) {
        this.objectConfigs = sceneEntities.objects || [];
        this.mirrorConfigs = sceneEntities.mirrors || [];
        this.generalConfig = generalConfig;
        this.svgCanvas = svgCanvas;
        this.polygons = [];
        this.mirrors = [];
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        console.log('MainSimulation initialized');
        this.createPolygons();
        this.createMirrors();
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
                parentSvg: this.svgCanvas,
                draggable: this.generalConfig.interaction.draggablePolygons
            });
            
            return polygon;
        });
    }

    /**
     * Create Mirror instances and their SVG elements
     */
    createMirrors() {
        this.mirrors = this.mirrorConfigs.map(mirrorConfig => {
            const mirror = new Mirror({
                x1: mirrorConfig.x1,
                y1: mirrorConfig.y1,
                x2: mirrorConfig.x2,
                y2: mirrorConfig.y2,
                thickness: mirrorConfig.thickness,
                reflectiveColor: mirrorConfig.reflectiveColor,
                backColor: mirrorConfig.backColor,
                strokeWidth: mirrorConfig.strokeWidth,
                parentSvg: this.svgCanvas,
                draggable: this.generalConfig.interaction.draggableMirrors
            });
            
            return mirror;
        });
    }
    
    /**
     * Clean up simulation resources and stop all processes
     */
    destroy() {
        // Destroy all polygons
        this.polygons.forEach(polygon => polygon.destroy());
        this.polygons = [];
        
        // Destroy all mirrors
        this.mirrors.forEach(mirror => mirror.destroy());
        this.mirrors = [];
        
        console.log('MainSimulation destroyed');
    }
}
