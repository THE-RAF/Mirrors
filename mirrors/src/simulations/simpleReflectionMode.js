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

// Constants
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const DEFAULT_VALUES = {
    viewer: {
        radius: 8,
        fill: '#4a90e2',
        stroke: '#333',
        strokeWidth: 2
    },
    lightBeam: {
        maxLength: 800,
        strokeColor: '#ffdd00',
        strokeWidth: 2,
        animationDuration: 1000
    }
};

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
        // Store configuration
        this.polygonConfigs = sceneEntities.objects || [];
        this.mirrorConfigs = sceneEntities.mirrors || [];
        this.viewerConfigs = sceneEntities.viewers || [];
        this.lightBeamConfigs = sceneEntities.lightBeams || [];
        this.modeConfig = modeConfig;
        this.svgCanvas = svgCanvas;
        
        // Initialize entity arrays
        this.polygons = [];
        this.mirrors = [];
        this.viewers = [];
        
        // Initialize layers first
        this.initializeSVGLayers();
        
        // Initialize engines
        this.reflectionEngine = new ReflectionEngine({ 
            svgCanvas: this.middleLayer,  // Virtual objects go to middle layer
            onVirtualPolygonClick: ({ virtualPolygon, event }) => {
                this.handleVirtualPolygonClick({ virtualPolygon });
            },
            virtualPolygonsClickable: this.modeConfig.lightBeamProjector.enabled
        });
        this.lightBeamEngine = new LightBeamEngine({ svgCanvas: this.backgroundLayer });
        
        // Initialize systems (will be set after entities are created)
        this.lightBeamProjector = null;
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        try {
            this.initializeEntities();
            this.initializeSystems();
            this.setupSceneUpdates();
        } catch (error) {
            console.error('Failed to initialize SimpleReflectionMode:', error);
            throw error;
        }
    }

    /**
     * Initialize all simulation entities in correct order
     */
    initializeEntities() {
        this.initializePolygons();
        this.initializeMirrors();
        this.initializeViewers();
        this.initializeLightBeams();
    }

    /**
     * Initialize simulation systems and components
     */
    initializeSystems() {
        this.initializeReflections();
        this.initializeLightBeamProjector();
    }

    /**
     * Initialize reflection system (if enabled in config)
     */
    initializeReflections() {
        if (this.modeConfig.reflections?.enabled !== false) {
            this.reflectionEngine.createReflections({ 
                polygons: this.polygons, 
                viewers: this.viewers, 
                mirrors: this.mirrors 
            });
        }
    }

    /**
     * Initialize SVG layer groups for proper z-ordering
     * Layers are created in order: background (bottom) → middle → foreground (top)
     */
    initializeSVGLayers() {
        // Create background layer (for light beams)
        this.backgroundLayer = this.createSVGLayer({ className: 'background-layer' });
        
        // Create middle layer (for reflections and virtual objects)
        this.middleLayer = this.createSVGLayer({ className: 'middle-layer' });
        
        // Create foreground layer (for real polygons, mirrors, viewers)
        this.foregroundLayer = this.createSVGLayer({ className: 'foreground-layer' });
    }

    /**
     * Create and append a single SVG layer group
     * @param {Object} config
     * @param {string} config.className - CSS class name for the layer
     * @returns {SVGGElement} The created layer element
     */
    createSVGLayer({ className }) {
        const layer = document.createElementNS(SVG_NAMESPACE, 'g');
        layer.setAttribute('class', className);
        this.svgCanvas.appendChild(layer);
        return layer;
    }

    /**
     * Initialize polygon entities from configuration
     */
    initializePolygons() {
        this.polygons = this.polygonConfigs.map(polygonConfig => {
            const polygon = new Polygon({
                vertices: polygonConfig.vertices,
                fill: polygonConfig.fill,
                parentSvg: this.foregroundLayer,
                draggable: this.modeConfig.interaction?.draggablePolygons ?? true
            });
            
            return polygon;
        });
    }

    /**
     * Initialize mirror entities from configuration
     */
    initializeMirrors() {
        this.mirrors = this.mirrorConfigs.map(mirrorConfig =>
            new Mirror({
                x1: mirrorConfig.x1,
                y1: mirrorConfig.y1,
                x2: mirrorConfig.x2,
                y2: mirrorConfig.y2,
                parentSvg: this.foregroundLayer,
                draggable: this.modeConfig.interaction?.draggableMirrors ?? true
            })
        );
    }

    /**
     * Initialize viewer entities from configuration
     */
    initializeViewers() {
        this.viewers = this.viewerConfigs.map(viewerConfig =>
            new Viewer({
                x: viewerConfig.x,
                y: viewerConfig.y,
                radius: viewerConfig.radius || DEFAULT_VALUES.viewer.radius,
                fill: viewerConfig.fill || DEFAULT_VALUES.viewer.fill,
                stroke: viewerConfig.stroke || DEFAULT_VALUES.viewer.stroke,
                strokeWidth: viewerConfig.strokeWidth || DEFAULT_VALUES.viewer.strokeWidth,
                parentSvg: this.foregroundLayer,
                draggable: this.modeConfig.interaction?.draggableViewers ?? true
            })
        );
    }

    /**
     * Initialize light beam entities from configuration
     */
    initializeLightBeams() {
        this.lightBeamConfigs.forEach(beamConfig => {
            this.lightBeamEngine.createLightBeam({
                emissionPoint: beamConfig.emissionPoint,
                directorVector: beamConfig.directorVector,
                maxLength: beamConfig.maxLength || DEFAULT_VALUES.lightBeam.maxLength,
                strokeColor: beamConfig.strokeColor || DEFAULT_VALUES.lightBeam.strokeColor,
                strokeWidth: beamConfig.strokeWidth || DEFAULT_VALUES.lightBeam.strokeWidth,
                animated: beamConfig.animated ?? true,
                animationDuration: beamConfig.animationDuration || DEFAULT_VALUES.lightBeam.animationDuration,
                mirrors: this.mirrors
            });
        });
    }

    /**
     * Initialize light beam projector system (if enabled in config)
     */
    initializeLightBeamProjector() {
        if (this.modeConfig.lightBeamProjector.enabled) {
            this.lightBeamProjector = new LightBeamProjector({
                svgCanvas: this.backgroundLayer,
                viewer: this.viewers[0],
                lightBeamEngine: this.lightBeamEngine,
                mirrors: this.mirrors,
                beamConfig: this.modeConfig.lightBeamProjector.config
            });
        } else {
            this.lightBeamProjector = null;
        }
    }

    /**
     * Set up drag update handler with throttling for performance
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
                    
                    // Only update projections if projector is enabled
                    if (this.lightBeamProjector) {
                        this.lightBeamProjector.updateAllProjections();
                    }
                    
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
        const entityGroups = [this.polygons, this.mirrors, this.viewers];
        return entityGroups.some(group => 
            group.some(entity => entity.isDragging)
        );
    }

    /**
     * Handle virtual polygon click for light beam projection
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    handleVirtualPolygonClick({ virtualPolygon }) {
        if (this.lightBeamProjector) {
            this.lightBeamProjector.handleVirtualPolygonClick({ virtualPolygon });
        }
    }

    /**
     * Clean up all simulation resources
     */
    destroy() {
        try {
            this.destroyEntities();
            this.destroyEngines();
            this.destroySVGLayers();
            this.clearEntityArrays();
        } catch (error) {
            console.error('Error during SimpleReflectionMode destruction:', error);
        }
    }

    /**
     * Destroy all simulation entities
     */
    destroyEntities() {
        const entityGroups = [this.polygons, this.mirrors, this.viewers];
        entityGroups.forEach(group => {
            group.forEach(entity => entity.destroy());
        });
    }

    /**
     * Destroy all engines and systems
     */
    destroyEngines() {
        this.reflectionEngine?.destroy();
        this.lightBeamEngine?.destroy();
        
        if (this.lightBeamProjector) {
            this.lightBeamProjector.clearAllProjections();
        }
    }

    /**
     * Clean up SVG layers
     */
    destroySVGLayers() {
        // Remove layers in reverse order (top to bottom)
        this.removeSVGLayer({ layer: this.foregroundLayer });
        this.removeSVGLayer({ layer: this.middleLayer });
        this.removeSVGLayer({ layer: this.backgroundLayer });
        
        // Clear references
        this.backgroundLayer = null;
        this.middleLayer = null;
        this.foregroundLayer = null;
    }

    /**
     * Safely remove a single SVG layer
     * @param {Object} config
     * @param {SVGGElement} config.layer - The layer to remove
     */
    removeSVGLayer({ layer }) {
        if (layer?.parentNode) {
            layer.parentNode.removeChild(layer);
        }
    }

    /**
     * Clear entity arrays
     */
    clearEntityArrays() {
        this.polygons = [];
        this.mirrors = [];
        this.viewers = [];
    }
}
