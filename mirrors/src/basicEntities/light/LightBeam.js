/**
 * @file LightBeam.js - Light beam object for ray tracing simulations
 * Main exports: LightBeam
 */

/**
 * @class LightBeam
 * Light beam object that renders as line segments in SVG
 */
export class LightBeam {
    /**
     * @param {Object} config
     * @param {Array} config.points - Array of {x, y} points defining the light beam path
     * @param {string} [config.stroke='#ffff00'] - Stroke color of the light beam
     * @param {number} [config.strokeWidth=2] - Stroke width of the light beam
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    constructor({ 
        points, 
        stroke = '#f5e911', 
        strokeWidth = 2, 
        parentSvg 
    }) {
        this.points = points;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.element = null;
        
        this.createSvg({ parentSvg });
    }
    
    /**
     * Create and return the SVG polyline element representing the light beam
     * @param {Object} config
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created polyline element
     */
    createSvg({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG polyline element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        
        // Convert points to SVG points string
        const pointsString = this.points
            .map(point => `${point.x},${point.y}`)
            .join(' ');
        
        // Set polyline attributes
        this.element.setAttribute('points', pointsString);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        this.element.setAttribute('fill', 'none');
        
        // Add some visual styling for light beam appearance
        this.element.setAttribute('stroke-linecap', 'round');
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Update the SVG polyline based on current points
     */
    updateBeamPath() {
        if (!this.element) return;
        
        // Convert points to SVG points string
        const pointsString = this.points
            .map(point => `${point.x},${point.y}`)
            .join(' ');
        
        // Update polyline points
        this.element.setAttribute('points', pointsString);
    }
    
    /**
     * Remove the light beam from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
