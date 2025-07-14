/**
 * @file squareMirrorBoxMode.js - Square mirror box simulation mode
 * Uses symmetry-based tiling instead of ray-tracing for infinite mirror effects
 */

import { MirrorBox } from '../core/composedEntities/real/MirrorBox.js';
import { VirtualMirrorBox } from '../core/composedEntities/virtual/VirtualMirrorBox.js';

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
        
        // Virtual tiled boxes (will be implemented later)
        this.virtualBoxes = [];
    }

    /**
     * Initialize the simulation
     */
    init() {
        this.createRealBox();
        this.createTestVirtualBox();
        console.log('Square mirror box simulation started');
    }

    /**
     * Create the central mirror box with internal polygons and viewers
     */
    createRealBox() {
        const { center, boxWidth, boxHeight } = this.boxConfig;
        
        this.realBox = new MirrorBox({
            x: center.x,
            y: center.y,
            boxWidth: boxWidth,
            boxHeight: boxHeight,
            parentSvg: this.svgCanvas,
            polygons: this.polygonConfigs,
            viewers: this.viewerConfigs,
            isDraggable: this.modeConfig.interaction.draggableMirrors,
            polygonsDraggable: this.modeConfig.interaction.draggableObjects,
            viewersDraggable: this.modeConfig.interaction.draggableViewers
        });
    }

    /**
     * Create a test virtual mirror box (simple demonstration)
     */
    createTestVirtualBox() {
        const { center, boxWidth, boxHeight } = this.boxConfig;
        
        // Create a virtual box slightly offset from the real one for testing
        const virtualBox = new VirtualMirrorBox({
            x: center.x + boxWidth + 50,  // Offset to the right
            y: center.y,
            boxWidth: boxWidth,
            boxHeight: boxHeight,
            parentSvg: this.svgCanvas,
            polygons: this.polygonConfigs,  // Same polygons as real box
            viewers: this.viewerConfigs,    // Same viewers as real box
            sourceMirrorBox: this.realBox, // Reference to source
            opacity: 0.4                   // Slightly more visible for demo
        });
        
        this.virtualBoxes.push(virtualBox);
    }

    /**
     * Update simulation (placeholder)
     */
    update() {
        // TODO: Update virtual boxes when real objects move
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.realBox) {
            this.realBox.destroy();
            this.realBox = null;
        }
        
        // Clean up virtual boxes
        this.virtualBoxes.forEach(virtualBox => virtualBox.destroy());
        this.virtualBoxes = [];
    }
}
