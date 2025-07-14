/**
 * @file VirtualMirror.js - Virtual mirror object for reflections
 * Main exports: VirtualMirror
 */

import { Mirror } from '../real/Mirror.js';

/**
 * @class VirtualMirror
 * Virtual mirror that represents reflections with distinctive visual styling
 */
export class VirtualMirror extends Mirror {
    /**
     * @param {Object} config
     * @param {number} config.x1 - Start x coordinate
     * @param {number} config.y1 - Start y coordinate
     * @param {number} config.x2 - End x coordinate
     * @param {number} config.y2 - End y coordinate
     * @param {number} [config.thickness=4] - Mirror thickness in pixels
     * @param {string} [config.reflectiveColor='#888'] - Color of reflective side
     * @param {string} [config.centerColor='#000'] - Color of center line
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=false] - Whether the mirror can be dragged (always false for virtual)
     * @param {Object} [config.sourceMirror] - Reference to the real mirror this virtual mirror reflects
     * @param {Object} [config.reflectionMirror] - Reference to the mirror that creates this reflection
     * @param {number} [config.opacity=0.5] - Opacity level for the virtual mirror
     */
    constructor({ 
        x1, y1, x2, y2, 
        thickness = 3, 
        reflectiveColor = '#999', 
        centerColor = '#666', 
        parentSvg, 
        draggable = false,
        sourceMirror = null,
        reflectionMirror = null,
        opacity = 0.2
    }) {
        super({
            x1, y1, x2, y2,
            thickness,
            reflectiveColor,
            centerColor,
            parentSvg,
            draggable: false // Virtual mirrors are never draggable
        });
        
        // Store source references for tracking the origin of this reflection
        this.sourceMirror = sourceMirror;
        this.reflectionMirror = reflectionMirror;
        this.opacity = opacity;
        
        this.applyVirtualStyling();
    }
    
    /**
     * Apply virtual-specific styling to the SVG elements
     */
    applyVirtualStyling() {
        if (!this.group) return;
        
        // Set custom opacity for the entire group
        this.group.setAttribute('opacity', this.opacity.toString());
        
        // Remove cursor styling since virtual mirrors are not interactive
        this.group.removeAttribute('cursor');
    }
    
    /**
     * Update mirror position and coordinates
     * @param {Object} config
     * @param {number} config.x1 - New start x coordinate
     * @param {number} config.y1 - New start y coordinate
     * @param {number} config.x2 - New end x coordinate
     * @param {number} config.y2 - New end y coordinate
     */
    updatePosition({ x1, y1, x2, y2 }) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        
        this.updateLines();
    }
}
