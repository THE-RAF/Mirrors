/**
 * @file Polygon.js - Minimal polygon object for rendering
 * Main exports: Polygon
 */

/**
 * @class Polygon
 * Minimal polygon object that renders to SVG
 */
export class Polygon {
    /**
     * @param {Object} config
     * @param {Array} config.vertices - Array of {x, y} points defining the polygon
     * @param {string} [config.fill='#ff6b6b'] - Fill color of the polygon
     * @param {string} [config.stroke='#333'] - Stroke color
     * @param {number} [config.strokeWidth=2] - Stroke width
     */
    constructor({ vertices, fill = '#ff6b6b', stroke = '#333', strokeWidth = 2, parentSvg }) {
        this.vertices = vertices;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.element = null;

        this.createSvg({ parentSvg });
    }
    
    /**
     * Create and return the SVG polygon element
     * @param {Object} config
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created polygon element
     */
    createSvg({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG polygon element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        // Convert vertices to SVG points string
        const pointsString = this.vertices
            .map(vertex => `${vertex.x},${vertex.y}`)
            .join(' ');
        
        // Set attributes
        this.element.setAttribute('points', pointsString);
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Remove the polygon from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
