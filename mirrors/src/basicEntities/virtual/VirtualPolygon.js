/**
 * @file VirtualPolygon.js - Virtual polygon object for reflections
 * Main exports: VirtualPolygon
 */

import { Polygon } from '../real/Polygon.js';

/**
 * @class VirtualPolygon
 * Virtual polygon that represents reflections with distinctive visual styling
 */
export class VirtualPolygon extends Polygon {
    /**
     * @param {Object} config
     * @param {Array} config.vertices - Array of {x, y} points defining the polygon
     * @param {string} [config.fill='#ff6b6b'] - Fill color (will be desaturated)
     * @param {string} [config.stroke='#999'] - Stroke color
     * @param {number} [config.strokeWidth=1] - Stroke width
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=false] - Whether the polygon can be dragged
     */
    constructor({ 
        vertices, 
        fill = '#ff6b6b', 
        stroke = '#333', 
        strokeWidth = 2, 
        parentSvg, 
        draggable = false 
    }) {
        super({
            vertices,
            fill,
            stroke,
            strokeWidth,
            parentSvg,
            draggable
        });
        
        this.applyVirtualStyling();
    }
    
    /**
     * Apply virtual-specific styling to the SVG element
     */
    applyVirtualStyling() {
        if (!this.element) return;
        
        // Add dashed stroke
        this.element.setAttribute('stroke-dasharray', '8,4');
        
        // Reduce opacity for virtual appearance
        this.element.setAttribute('opacity', '0.5');
    }
}
