/**
 * @file infiniteReflectionMode.js - Infinite reflection mode simulation
 * 
 * ⚠️  EXPERIMENTAL MODE ⚠️
 * This mode is experimental and uses the InfiniteReflectionEngine.
 * May cause performance issues or unexpected behavior.
 * 
 * Main exports: InfiniteReflectionMode
 */

import { Polygon } from '../basicEntities/real/Polygon.js';
import { Mirror } from '../basicEntities/real/Mirror.js';
import { Viewer } from '../basicEntities/real/Viewer.js';
import { InfiniteReflectionEngine } from '../engines/InfiniteReflectionEngine.js';
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
    },
    infiniteReflections: {
        maxDepth: 3,
        fadeRate: 0.7,
        minOpacity: 0.1
    }
};

/**
 * @class InfiniteReflectionMode
 * 
 * ⚠️  EXPERIMENTAL SIMULATION MODE ⚠️
 * 
 * Specialized simulation engine for infinite mirror reflections.
 * This mode is designed specifically for complex reflection scenarios
 * and uses the experimental InfiniteReflectionEngine.
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Monitor object counts and frame rates
 * - Use conservative maxDepth settings (≤ 4)
 * - Consider reducing fadeRate or increasing minOpacity for better performance
 */
export class InfiniteReflectionMode {
    /**
     * @param {Object} config
     * @param {Object} config.sceneEntities - Scene configuration containing objects
     * @param {Object} config.modeConfig - Mode-specific configuration
     * @param {SVGElement} config.svgCanvas - SVG element for rendering
     */
    constructor({ sceneEntities, modeConfig, svgCanvas }) {
        console.warn('⚠️  InfiniteReflectionMode: EXPERIMENTAL MODE INITIALIZED');
        console.warn('Monitor performance and watch for warnings in the console.');
        
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
        
        // Initialize engines - Only infinite reflection engine for this mode
        this.infiniteReflectionEngine = new InfiniteReflectionEngine({ 
            svgCanvas: this.middleLayer,  // Virtual objects go to middle layer
            onVirtualPolygonClick: ({ virtualPolygon, event }) => {
                this.handleVirtualPolygonClick({ virtualPolygon });
            },
            virtualPolygonsClickable: this.modeConfig.lightBeamProjector?.enabled ?? true
        });
        
        this.lightBeamEngine = new LightBeamEngine({ svgCanvas: this.backgroundLayer });
        
        // Initialize systems (will be set after entities are created)
        this.lightBeamProjector = null;
        
        // Performance tracking
        this.performanceStats = {
            lastFrameTime: 0,
            frameCount: 0,
            avgFrameTime: 0
        };
    }
    
    /**
     * Initialize the simulation environment and create all entities
     */
    init() {
        try {
            this.initializeEntities();
            this.initializeSystems();
            this.setupSceneUpdates();
            this.setupPerformanceMonitoring();
        } catch (error) {
            console.error('Failed to initialize InfiniteReflectionMode:', error);
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
        this.initializeInfiniteReflections();
        this.initializeLightBeamProjector();
    }

    /**
     * Initialize infinite reflection system
     */
    initializeInfiniteReflections() {
        // Merge default config with user config
        const infiniteConfig = {
            ...DEFAULT_VALUES.infiniteReflections,
            ...this.modeConfig.infiniteReflections
        };
        
        console.log('InfiniteReflectionMode: Initializing with config:', infiniteConfig);
        
        this.infiniteReflectionEngine.createInfiniteReflections({ 
            polygons: this.polygons, 
            viewers: this.viewers, 
            mirrors: this.mirrors,
            infiniteConfig: infiniteConfig
        });
        
        // Log initial statistics
        const stats = this.infiniteReflectionEngine.getStats();
        console.log('InfiniteReflectionMode: Initial stats:', stats);
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
                parentSvg: this.middleLayer,
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
        if (this.modeConfig.lightBeamProjector?.enabled) {
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
                    const startTime = performance.now();
                    
                    // Update infinite reflections
                    const infiniteConfig = {
                        ...DEFAULT_VALUES.infiniteReflections,
                        ...this.modeConfig.infiniteReflections
                    };
                    
                    this.infiniteReflectionEngine.updateInfiniteReflections({ 
                        polygons: this.polygons, 
                        viewers: this.viewers, 
                        mirrors: this.mirrors,
                        infiniteConfig: infiniteConfig
                    });
                    
                    this.lightBeamEngine.updateAllLightBeamReflections({ mirrors: this.mirrors });
                    
                    // Only update projections if projector is enabled
                    if (this.lightBeamProjector) {
                        this.lightBeamProjector.updateAllProjections();
                    }
                    
                    // Track performance
                    const endTime = performance.now();
                    this.updatePerformanceStats(endTime - startTime);
                    
                    updateScheduled = false;
                });
            }
        });
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Log performance stats every 5 seconds
        setInterval(() => {
            const stats = this.infiniteReflectionEngine.getStats();
            if (stats.enabled && this.performanceStats.frameCount > 0) {
                console.log('InfiniteReflectionMode Performance:', {
                    avgFrameTime: this.performanceStats.avgFrameTime.toFixed(2) + 'ms',
                    virtualObjects: stats.totalVirtualPolygons + stats.totalVirtualViewers,
                    maxDepth: stats.maxDepth,
                    avgDepth: stats.avgDepth.toFixed(1)
                });
                
                // Warn if performance is poor
                if (this.performanceStats.avgFrameTime > 16) {
                    console.warn('⚠️  Performance warning: Frame time exceeding 16ms. Consider reducing maxDepth or increasing minOpacity.');
                }
            }
        }, 5000);
    }

    /**
     * Update performance statistics
     * @param {number} frameTime - Time taken for this frame in milliseconds
     */
    updatePerformanceStats(frameTime) {
        this.performanceStats.frameCount++;
        this.performanceStats.avgFrameTime = 
            (this.performanceStats.avgFrameTime * (this.performanceStats.frameCount - 1) + frameTime) / 
            this.performanceStats.frameCount;
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
     * Get current performance and reflection statistics
     * @returns {Object} Combined statistics
     */
    getStats() {
        return {
            performance: this.performanceStats,
            reflections: this.infiniteReflectionEngine.getStats()
        };
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
            console.error('Error during InfiniteReflectionMode destruction:', error);
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
        this.infiniteReflectionEngine?.destroy();
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
