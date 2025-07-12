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
     * @param {boolean} [config.clickable=false] - Whether the virtual polygon can be clicked
     * @param {Function} [config.onVirtualClick] - Callback function when virtual polygon is clicked
     * @param {Object} [config.sourcePolygon] - Reference to the real polygon this virtual polygon reflects
     * @param {Object} [config.sourceMirror] - Reference to the mirror that creates this reflection
     */
    constructor({ 
        vertices, 
        fill = '#ff6b6b', 
        stroke = '#333', 
        strokeWidth = 2, 
        parentSvg, 
        draggable = false,
        clickable = false,
        onVirtualClick = null,
        sourcePolygon = null,
        sourceMirror = null
    }) {
        super({
            vertices,
            fill,
            stroke,
            strokeWidth,
            parentSvg,
            draggable
        });
        
        this.clickable = clickable;
        this.onVirtualClick = onVirtualClick;
        
        // Store source references for tracking the origin of this reflection
        this.sourcePolygon = sourcePolygon;
        this.sourceMirror = sourceMirror;
        
        this.applyVirtualStyling();
        
        if (this.clickable) {
            this.setupClickHandler();
        }
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
        
        // Add visual feedback for clickable virtual polygons
        if (this.clickable) {
            this.element.style.cursor = 'pointer';
        }
    }
    
    /**
     * Set up click event handler for virtual polygon
     */
    setupClickHandler() {
        if (!this.element) return;
        
        this.element.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // Visual feedback on click
            this.animateClick();
            
            // Call the callback if provided
            if (this.onVirtualClick) {
                this.onVirtualClick({ virtualPolygon: this, event });
            }
        });
        
        // Add hover effects for better UX
        this.element.addEventListener('mouseenter', () => {
            if (this.clickable) {
                this.element.setAttribute('opacity', '0.8');
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            if (this.clickable) {
                this.element.setAttribute('opacity', '0.5');
            }
        });
    }
    
    /**
     * Animate click feedback
     */
    animateClick() {
        if (!this.element) return;
        
        // Brief scale animation for click feedback
        const originalTransform = this.element.getAttribute('transform') || '';
        
        // Get polygon center for scaling origin
        const bbox = this.element.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        
        // Animate scale up and down
        this.element.animate([
            { transform: `${originalTransform} scale(1)`, transformOrigin: `${centerX}px ${centerY}px` },
            { transform: `${originalTransform} scale(1.1)`, transformOrigin: `${centerX}px ${centerY}px` },
            { transform: `${originalTransform} scale(1)`, transformOrigin: `${centerX}px ${centerY}px` }
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });
    }
}
