/**
 * @file simpleReflectionMode.js - Simple reflection mode simulation
 * Main exports: SimpleReflectionMode
 */

import { Polygon } from '../basicEntities/real/Polygon.js';
import { Mirror } from '../basicEntities/real/Mirror.js';
import { Viewer } from '../basicEntities/real/Viewer.js';
import { ReflectionEngine } from '../engines/ReflectionEngine.js';
import { LightBeamEngine } from '../engines/LightBeamEngine.js';
import { LightBeamProjector } from '../features/LightBeamProjector.js';

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
        this.viewerConfigs = sceneEntities.viewers || [];
        this.lightBeamConfigs = sceneEntities.lightBeams || [];
        this.modeConfig = modeConfig;
        this.svgCanvas = svgCanvas;
        this.polygons = [];
        this.mirrors = [];
        this.viewers = [];
        
        // Initialize engines
        this.reflectionEngine = new ReflectionEngine({ 
            svgCanvas,
            onVirtualPolygonClick: (virtualPolygon, event) => {
                this.handleVirtualPolygonClick({ virtualPolygon });
            }
        });
        this.lightBeamEngine = new LightBeamEngine({ svgCanvas });
        
        // Initialize virtual light caster (will be set after viewers are created)
        this.virtualLightCaster = null;
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        this.createPolygonsFromConfig();
        this.createMirrorsFromConfig();
        this.createViewersFromConfig();
        this.createLightBeamsFromConfig();
        this.createVirtualLightCaster();
        this.reflectionEngine.createReflections({ polygons: this.polygons, viewers: this.viewers, mirrors: this.mirrors });
        this.setupSceneUpdates();
    }

    /**
     * Create Polygon instances and their SVG elements from configuration
     */
    createPolygonsFromConfig() {
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
     * Create Mirror instances and their SVG elements from configuration
     */
    createMirrorsFromConfig() {
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
     * Create Viewer instances and their SVG elements from configuration
     */
    createViewersFromConfig() {
        this.viewers = this.viewerConfigs.map(viewerConfig =>
            new Viewer({
                x: viewerConfig.x,
                y: viewerConfig.y,
                radius: viewerConfig.radius || 8,
                fill: viewerConfig.fill || '#4a90e2',
                stroke: viewerConfig.stroke || '#333',
                strokeWidth: viewerConfig.strokeWidth || 2,
                parentSvg: this.svgCanvas,
                draggable: this.modeConfig.interaction?.draggableViewers ?? true
            })
        );
    }

    /**
     * Create LightBeam instances from configuration
     */
    createLightBeamsFromConfig() {
        this.lightBeamConfigs.forEach(beamConfig => {
            this.lightBeamEngine.createLightBeam({
                emissionPoint: beamConfig.emissionPoint,
                directorVector: beamConfig.directorVector,
                maxLength: beamConfig.maxLength || 800,
                strokeColor: beamConfig.strokeColor || '#ffdd00',
                strokeWidth: beamConfig.strokeWidth || 2,
                animated: beamConfig.animated ?? true,
                animationDuration: beamConfig.animationDuration || 1000,
                mirrors: this.mirrors
            });
        });
    }

    /**
     * Create virtual light caster
     */
    createVirtualLightCaster() {
        this.virtualLightCaster = new LightBeamProjector({
            svgCanvas: this.svgCanvas,
            viewer: this.viewers[0]
        });
    }

    /**
     * Set up efficient scene updating during dragging
     */
    setupSceneUpdates() {
        document.addEventListener('mousemove', () => {
            // Check if any real scene element is being dragged
            if (this.isSceneBeingDragged()) {
                this.reflectionEngine.updateReflections({ polygons: this.polygons, viewers: this.viewers, mirrors: this.mirrors });
                this.lightBeamEngine.updateAllLightBeamReflections({ mirrors: this.mirrors });
            }
        });
    }

    /**
     * Check if any element in the real scene is being dragged
     * @returns {boolean} True if any polygon, mirror, or viewer is being dragged
     */
    isSceneBeingDragged() {
        // Check if any polygon is being dragged
        const polygonDragging = this.polygons.some(polygon => polygon.isDragging);
        
        // Check if any mirror is being dragged
        const mirrorDragging = this.mirrors.some(mirror => mirror.isDragging);
        
        // Check if any viewer is being dragged
        const viewerDragging = this.viewers.some(viewer => viewer.isDragging);
        
        return polygonDragging || mirrorDragging || viewerDragging;
    }

    /**
     * Handle virtual polygon click
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    handleVirtualPolygonClick({ virtualPolygon }) {
        this.virtualLightCaster.castVirtualBeamToViewer({ virtualPolygon });
    }

    /**
     * Clean up all simulation resources
     */
    destroy() {
        // Destroy all entities
        this.polygons.forEach(polygon => polygon.destroy());
        this.mirrors.forEach(mirror => mirror.destroy());
        this.viewers.forEach(viewer => viewer.destroy());
        
        // Destroy engines and virtual light caster
        this.reflectionEngine.destroy();
        this.lightBeamEngine.destroy();
        this.virtualLightCaster.clearVirtualBeams();
        
        // Clear arrays
        this.polygons = [];
        this.mirrors = [];
        this.viewers = [];
    }
}
