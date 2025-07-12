/**
 * @file simpleReflectionMode.js - Simple reflection mode simulation
 * Main exports: SimpleReflectionMode
 */

import { Polygon } from '../basicEntities/real/Polygon.js';
import { Mirror } from '../basicEntities/real/Mirror.js';
import { Viewer } from '../basicEntities/real/Viewer.js';
import { ReflectionEngine } from '../engines/ReflectionEngine.js';
import { LightBeamEngine } from '../engines/LightBeamEngine.js';
import { LightBeamProjector } from '../feedbackSystems/lightBeamProjector/LightBeamProjector.js';

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
        
        // Initialize layers first
        this.createSVGLayers();
        
        // Initialize engines
        this.reflectionEngine = new ReflectionEngine({ 
            svgCanvas: this.virtualLayer,  // Virtual objects go to virtual layer
            onVirtualPolygonClick: (virtualPolygon, event) => {
                this.handleVirtualPolygonClick({ virtualPolygon });
            }
        });
        this.lightBeamEngine = new LightBeamEngine({ svgCanvas: this.beamLayer });
        
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
        this.createLightBeamProjector();
        this.reflectionEngine.createReflections({ polygons: this.polygons, viewers: this.viewers, mirrors: this.mirrors });
        this.setupSceneUpdates();
    }

    /**
     * Create SVG layer groups for proper z-ordering
     */
    createSVGLayers() {
        // Create background layer for light beams (bottom layer)
        this.beamLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.beamLayer.setAttribute('class', 'beam-layer');
        this.svgCanvas.appendChild(this.beamLayer);

        // Create middle layer for virtual objects (virtual polygons, virtual mirrors, virtual viewers)
        this.virtualLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.virtualLayer.setAttribute('class', 'virtual-layer');
        this.svgCanvas.appendChild(this.virtualLayer);

        // Create foreground layer for real objects (real polygons, real mirrors, real viewers) - top layer
        this.realLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.realLayer.setAttribute('class', 'real-layer');
        this.svgCanvas.appendChild(this.realLayer);
        
        // Keep objectLayer as an alias to realLayer for backward compatibility
        this.objectLayer = this.realLayer;
    }

    /**
     * Create Polygon instances and their SVG elements from configuration
     */
    createPolygonsFromConfig() {
        this.polygons = this.objectConfigs.map(objConfig => {
            const polygon = new Polygon({
                vertices: objConfig.vertices,
                fill: objConfig.fill,
                parentSvg: this.objectLayer,
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
                parentSvg: this.objectLayer,
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
                parentSvg: this.objectLayer,
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
     * Create light beam projector
     */
    createLightBeamProjector() {
        this.virtualLightCaster = new LightBeamProjector({
            svgCanvas: this.beamLayer,
            viewer: this.viewers[0],
            lightBeamEngine: this.lightBeamEngine,
            mirrors: this.mirrors,
            beamConfig: this.modeConfig.lightBeamProjectorConfig
        });
    }

    /**
     * Set up efficient scene updating during dragging with throttling
     */
    setupSceneUpdates() {
        let updateScheduled = false;
        
        document.addEventListener('mousemove', () => {
            // Check if any real scene element is being dragged
            if (this.isSceneBeingDragged() && !updateScheduled) {
                updateScheduled = true;
                
                // Use requestAnimationFrame to throttle updates to ~60fps max
                requestAnimationFrame(() => {
                    this.reflectionEngine.updateReflections({ polygons: this.polygons, viewers: this.viewers, mirrors: this.mirrors });
                    this.lightBeamEngine.updateAllLightBeamReflections({ mirrors: this.mirrors });
                    this.virtualLightCaster.updateAllProjections();
                    updateScheduled = false;
                });
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
        this.virtualLightCaster.handleVirtualPolygonClick({ virtualPolygon });
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
        
        // Clean up SVG layers
        if (this.beamLayer?.parentNode) {
            this.beamLayer.parentNode.removeChild(this.beamLayer);
        }
        if (this.virtualLayer?.parentNode) {
            this.virtualLayer.parentNode.removeChild(this.virtualLayer);
        }
        if (this.realLayer?.parentNode) {
            this.realLayer.parentNode.removeChild(this.realLayer);
        }
        
        // Clear arrays
        this.polygons = [];
        this.mirrors = [];
        this.viewers = [];
    }
}
