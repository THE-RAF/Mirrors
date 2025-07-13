/**
 * @file VirtualViewer.js - Virtual viewer object for reflections
 * Main exports: VirtualViewer
 */

import { Viewer } from '../real/Viewer.js';

/**
 * @class VirtualViewer
 * Virtual viewer that represents reflections with distinctive visual styling
 */
export class VirtualViewer extends Viewer {
    /**
     * @param {Object} config
     * @param {number} config.x - X coordinate of the viewer center
     * @param {number} config.y - Y coordinate of the viewer center
     * @param {number} [config.radius=8] - Radius of the viewer circle
     * @param {string} [config.fill='#4a90e2'] - Fill color of the viewer (default blue)
     * @param {string} [config.stroke='#333'] - Stroke color
     * @param {number} [config.strokeWidth=2] - Stroke width
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=false] - Whether the viewer can be dragged
     * @param {Object} [config.sourceViewer] - Reference to the real viewer this virtual viewer reflects
     * @param {Object} [config.sourceMirror] - Reference to the mirror that creates this reflection
     * @param {number} [config.opacity=0.5] - Opacity level for the virtual viewer
     */
    constructor({ 
        x, 
        y, 
        radius = 8, 
        fill = '#4a90e2', 
        stroke = '#333', 
        strokeWidth = 2, 
        parentSvg, 
        draggable = false,
        sourceViewer = null,
        sourceMirror = null,
        opacity = 0.5
    }) {
        super({
            x,
            y,
            radius,
            fill,
            stroke,
            strokeWidth,
            parentSvg,
            draggable
        });
        
        // Store source references for tracking the origin of this reflection
        this.sourceViewer = sourceViewer;
        this.sourceMirror = sourceMirror;
        this.opacity = opacity;
        
        this.applyVirtualStyling();
    }
    
    /**
     * Apply virtual-specific styling to the SVG element
     */
    applyVirtualStyling() {
        if (!this.element) return;
        
        // Add dashed stroke
        this.element.setAttribute('stroke-dasharray', '8,4');
        
        // Set custom opacity
        this.element.setAttribute('opacity', this.opacity.toString());
    }
}
