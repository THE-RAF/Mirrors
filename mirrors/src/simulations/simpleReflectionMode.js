/**
 * @file simpleReflectionMode.js - Simple reflection mode simulation
 * Main exports: SimpleReflectionMode
 */

import { Polygon } from '../basicEntities/real/Polygon.js';
import { Mirror } from '../basicEntities/real/Mirror.js';
import { VirtualPolygon } from '../basicEntities/virtual/VirtualPolygon.js';
import { reflectPolygonOverAxis } from '../math/reflections.js';

/**
 * @class SimpleReflectionMode
 * Minimal simulation engine for managing polygon objects in SVG
 */
export class SimpleReflectionMode {
    /**
     * @param {Object} config
     * @param {Object} config.sceneEntities - Scene configuration containing objects
     * @param {Object} config.modeConfig - Mode-specific configuration
     * @param {SVGElement} config.svgCanvas - SVG element for rendering
     */
    constructor({ sceneEntities, modeConfig, svgCanvas }) {
        this.objectConfigs = sceneEntities.objects || [];
        this.mirrorConfigs = sceneEntities.mirrors || [];
        this.modeConfig = modeConfig;
        this.svgCanvas = svgCanvas;
        this.polygons = [];
        this.mirrors = [];
        this.virtualPolygons = [];
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        this.createPolygons();
        this.createMirrors();
        this.createReflections();
    }

    /**
     * Create Polygon instances and their SVG elements
     */
    createPolygons() {
        this.polygons = this.objectConfigs.map(objConfig => {
            const polygon = new Polygon({
                vertices: objConfig.vertices,
                fill: objConfig.fill,
                parentSvg: this.svgCanvas,
                draggable: this.modeConfig.interaction?.draggablePolygons ?? true
            });
            
            return polygon;
        });
        
        // Set up global drag listener for reflection updates
        this.setupReflectionUpdates();
    }

    /**
     * Set up efficient reflection updating during polygon dragging
     */
    setupReflectionUpdates() {
        document.addEventListener('mousemove', () => {
            // Check if any real scene element is being dragged
            if (this.isSceneBeingDragged()) {
                this.updateReflections();
            }
        });
    }

    /**
     * Check if any element in the real scene is being dragged
     * @returns {boolean} True if any polygon or mirror is being dragged
     */
    isSceneBeingDragged() {
        // Check if any polygon is being dragged
        const polygonDragging = this.polygons.some(polygon => polygon.isDragging);
        
        // Check if any mirror is being dragged
        const mirrorDragging = this.mirrors.some(mirror => mirror.isDragging);
        
        return polygonDragging || mirrorDragging;
    }

    /**
     * Create Mirror instances and their SVG elements
     */
    createMirrors() {
        this.mirrors = this.mirrorConfigs.map(mirrorConfig =>
            new Mirror({
                x1: mirrorConfig.x1,
                y1: mirrorConfig.y1,
                x2: mirrorConfig.x2,
                y2: mirrorConfig.y2,
                parentSvg: this.svgCanvas,
                draggable: this.modeConfig.interaction?.draggableMirrors ?? true
            })
        );
    }

    /**
     * Create reflections of all polygons across all mirrors
     */
    createReflections() {
        this.polygons.forEach(polygon => {
            this.mirrors.forEach(mirror => {
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
     * Update all reflections based on current polygon positions
     */
    updateReflections() {
        // Clear existing reflections
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualPolygons = [];
        
        // Recreate reflections with current positions
        this.createReflections();
    }

    /**
     * Clean up all simulation resources
     */
    destroy() {
        // Destroy all polygons
        this.polygons.forEach(polygon => polygon.destroy());
        this.polygons = [];

        // Destroy all mirrors
        this.mirrors.forEach(mirror => mirror.destroy());
        this.mirrors = [];
        
        // Destroy all virtual polygons
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualPolygons = [];
    }
}
