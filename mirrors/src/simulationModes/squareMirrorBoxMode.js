/**
 * @file squareMirrorBoxMode.js - Square mirror box simulation mode
 * Uses symmetry-based tiling instead of ray-tracing for infinite mirror effects
 */

import { MirrorBox } from '../core/composedEntities/real/MirrorBox.js';
import { VirtualMirrorBox } from '../core/composedEntities/virtual/VirtualMirrorBox.js';
import { BoxReflectionEngine } from '../core/engines/boxReflectionEngine/boxReflectionEngine.js';
import { BoxReflectionTiling } from '../core/engines/boxReflectionEngine/BoxReflectionTiling.js';

/**
 * @class SquareMirrorBoxMode
 * Simple simulation mode that creates infinite mirror effects through geometric tiling
 * No reflection engines - uses coordinate transformations for virtual boxes
 */
export class SquareMirrorBoxMode {
    /**
     * @param {Object} config
     * @param {Object} config.sceneEntities - Scene configuration with objects and box config
     * @param {Object} config.modeConfig - Mode-specific configuration
     * @param {SVGElement} config.svgCanvas - SVG element for rendering
     */
    constructor({ sceneEntities, modeConfig, svgCanvas }) {
        this.polygonConfigs = sceneEntities.objects || [];
        this.viewerConfigs = sceneEntities.viewers || [];
        this.boxConfig = sceneEntities.boxConfig;
        this.modeConfig = modeConfig;
        this.svgCanvas = svgCanvas;

        // Real mirror box (contains mirrors, polygons, and viewers)
        this.realBox = null;
        
        // Box reflection tiling engine for creating infinite mirror effects
        this.boxTiling = new BoxReflectionTiling({
            svgCanvas: this.svgCanvas,
            canvasWidth: 800,  // TODO: Get from config
            canvasHeight: 800  // TODO: Get from config
        });
        
        // Keep the individual reflection engine for compatibility (may remove later)
        this.boxReflectionEngine = new BoxReflectionEngine({
            svgCanvas: this.svgCanvas
        });
        
        // Virtual tiled boxes (managed by tiling engine)
        this.virtualBoxes = [];
    }

    /**
     * Initialize the simulation
     */
    init() {
        this.createRealBox();
        this.createTiling();
        this.setupUpdateSystem();
        console.log('Square mirror box simulation started');
    }

    /**
     * Create the central mirror box with internal polygons and viewers
     */
    createRealBox() {
        const { center, boxWidth, boxHeight, mirrorThickness } = this.boxConfig;
        
        this.realBox = new MirrorBox({
            x: center.x,
            y: center.y,
            boxWidth: boxWidth,
            boxHeight: boxHeight,
            thickness: mirrorThickness,
            parentSvg: this.svgCanvas,
            polygons: this.polygonConfigs,
            viewers: this.viewerConfigs,
            isDraggable: this.modeConfig.interaction.draggableMirrors,
            polygonsDraggable: this.modeConfig.interaction.draggableObjects,
            viewersDraggable: this.modeConfig.interaction.draggableViewers
        });
    }

    /**
     * Create tiling pattern using BoxReflectionTiling engine
     */
    createTiling() {
        this.boxTiling.createTiling({
            sourceBox: this.realBox,
            opacity: 0.4  // Slightly more visible for testing
        });
        
        // Get virtual boxes from tiling engine for update system compatibility
        this.virtualBoxes = this.boxTiling.getVirtualBoxes();
        
        console.log('Created box tiling pattern');
    }

    /**
     * Setup the update system for real-time reflection updates
     */
    setupUpdateSystem() {
        let updateScheduled = false;
        
        document.addEventListener('mousemove', () => {
            // Check if any real scene element is being dragged
            if (this.isSceneBeingDragged() && !updateScheduled) {
                updateScheduled = true;
                
                // Use requestAnimationFrame to throttle updates to ~60fps max
                requestAnimationFrame(() => {
                    this.update();
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
        if (!this.realBox) return false;
        
        const polygons = this.realBox.getPolygons();
        const viewers = this.realBox.getViewers();
        const mirrors = this.realBox.getMirrors();
        
        const entityGroups = [polygons, viewers, mirrors];
        return entityGroups.some(group => 
            group.some(entity => entity.isDragging)
        );
    }

    /**
     * Update simulation - synchronize virtual boxes with real box changes
     */
    update() {
        // Update the tiling pattern when real objects move
        this.boxTiling.updateTiling({ sourceBox: this.realBox });
        
        // Update local reference for compatibility
        this.virtualBoxes = this.boxTiling.getVirtualBoxes();
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.realBox) {
            this.realBox.destroy();
            this.realBox = null;
        }
        
        // Clean up tiling engine
        if (this.boxTiling) {
            this.boxTiling.destroy();
            this.boxTiling = null;
        }
        
        // Clean up individual box reflection engine
        if (this.boxReflectionEngine) {
            this.boxReflectionEngine.destroy();
            this.boxReflectionEngine = null;
        }
        
        this.virtualBoxes = [];
    }
}
