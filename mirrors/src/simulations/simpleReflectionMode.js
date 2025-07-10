/**
 * @file simpleReflectionMode.js - Simple reflection mode simulation
 * Main exports: SimpleReflectionMode
 */

import { Polygon } from '../basicEntities/real/Polygon.js';
import { Mirror } from '../basicEntities/real/Mirror.js';
import { ReflectionEngine } from '../engines/ReflectionEngine.js';

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
        
        // Initialize reflection engine
        this.reflectionEngine = new ReflectionEngine({ svgCanvas });
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        this.createPolygons();
        this.createMirrors();
        this.reflectionEngine.createReflections(this.polygons, this.mirrors);
        this.setupReflectionUpdates();
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
    }

    /**
     * Set up efficient reflection updating during polygon dragging
     */
    setupReflectionUpdates() {
        document.addEventListener('mousemove', () => {
            // Check if any real scene element is being dragged
            if (this.isSceneBeingDragged()) {
                this.reflectionEngine.updateReflections(this.polygons, this.mirrors);
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
     * Clean up all simulation resources
     */
    destroy() {
        // Destroy all polygons
        this.polygons.forEach(polygon => polygon.destroy());
        this.polygons = [];

        // Destroy all mirrors
        this.mirrors.forEach(mirror => mirror.destroy());
        this.mirrors = [];
        
        // Destroy reflection engine and all virtual polygons
        this.reflectionEngine.destroy();
    }
}
