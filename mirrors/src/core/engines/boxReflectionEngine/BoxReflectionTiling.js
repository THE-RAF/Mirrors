/**
 * @file BoxReflectionTiling.js - Engine for tiling the canvas with reflected mirror boxes
 * Main exports: BoxReflectionTiling
 */

import { BoxReflectionEngine } from './boxReflectionEngine.js';

/**
 * @class BoxReflectionTiling
 * Specialized engine for creating an infinite tiling pattern of reflected mirror boxes
 * Uses BoxReflectionEngine to create individual reflections and arranges them in a grid pattern
 */
export class BoxReflectionTiling {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual objects
     * @param {number} config.canvasWidth - Width of the canvas to tile
     * @param {number} config.canvasHeight - Height of the canvas to tile
     * @param {Function} [config.onVirtualPolygonClick] - Callback for virtual polygon clicks
     * @param {boolean} [config.virtualPolygonsClickable=true] - Whether virtual polygons should be clickable
     */
    constructor({ 
        svgCanvas, 
        canvasWidth, 
        canvasHeight,
        onVirtualPolygonClick = null, 
        virtualPolygonsClickable = true 
    }) {
        this.svgCanvas = svgCanvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Box reflection engine for creating individual reflections
        this.boxReflectionEngine = new BoxReflectionEngine({
            svgCanvas,
            onVirtualPolygonClick,
            virtualPolygonsClickable
        });
        
        // Array to store all virtual boxes in the tiling pattern
        this.virtualBoxes = [];
    }

    /**
     * Create a tiling pattern of reflected boxes across the canvas
     * @param {Object} config
     * @param {MirrorBox} config.sourceBox - The real MirrorBox to use as the source for tiling
     * @param {number} [config.opacity=0.3] - Opacity for the virtual box components
     */
    createTiling({ sourceBox, opacity = 0.3 }) {
        // Clear any existing virtual boxes
        this.clearTiling();
        
        // For now, create a single test reflection to the right
        this.createSingleTestReflection({ sourceBox, opacity });
        
        console.log('BoxReflectionTiling: Created test reflection');
    }

    /**
     * Create a single test reflection (placeholder for full tiling algorithm)
     * @param {Object} config
     * @param {MirrorBox} config.sourceBox - The real MirrorBox to reflect
     * @param {number} config.opacity - Opacity for the virtual box components
     */
    createSingleTestReflection({ sourceBox, opacity }) {
        // Get the right mirror of the source box to reflect across
        const sourceMirrors = sourceBox.getMirrors();
        const rightMirror = sourceMirrors[1]; // Index 1 is the right mirror
        
        // Create a reflection across the right mirror
        const reflectedBox = this.boxReflectionEngine.reflectBox({
            sourceBox: sourceBox,
            reflectionMirror: rightMirror,
            opacity: opacity
        });
        
        this.virtualBoxes.push(reflectedBox);
    }

    /**
     * Update all virtual boxes in the tiling when the source changes
     * @param {Object} config
     * @param {MirrorBox} config.sourceBox - The source box that changed
     */
    updateTiling({ sourceBox }) {
        // Update all virtual boxes
        this.virtualBoxes.forEach(virtualBox => {
            this.boxReflectionEngine.updateReflectedBox({ virtualBox });
        });
    }

    /**
     * Clear all virtual boxes from the tiling
     */
    clearTiling() {
        this.virtualBoxes.forEach(virtualBox => virtualBox.destroy());
        this.virtualBoxes = [];
    }

    /**
     * Get all virtual boxes in the current tiling
     * @returns {Array<VirtualMirrorBox>} Array of virtual mirror boxes
     */
    getVirtualBoxes() {
        return this.virtualBoxes;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.clearTiling();
        
        if (this.boxReflectionEngine) {
            this.boxReflectionEngine.destroy();
            this.boxReflectionEngine = null;
        }
    }
}
