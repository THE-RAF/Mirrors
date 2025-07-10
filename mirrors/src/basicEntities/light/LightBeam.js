/**
 * @file LightBeam.js - Light beam object for ray tracing simulations
 * Main exports: LightBeam
 */

/**
 * @class LightBeam
 * Light beam object that renders as a ray in SVG
 */
export class LightBeam {
    /**
     * @param {Object} config
     * @param {Object} config.emissionPoint - Starting point of the light beam {x, y}
     * @param {Object} config.emissionDirection - Direction vector of the beam {x, y} (normalized)
     * @param {string} [config.stroke='#ffff00'] - Stroke color of the light beam
     * @param {number} [config.strokeWidth=2] - Stroke width of the light beam
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    constructor({ 
        emissionPoint, 
        emissionDirection, 
        stroke = '#ffff00', 
        strokeWidth = 2, 
        parentSvg 
    }) {
        this.emissionPoint = emissionPoint;
        this.emissionDirection = emissionDirection;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.element = null;
        
        this.createSvg({ parentSvg });
    }
    
    /**
     * Create and return the SVG line element representing the light beam
     * @param {Object} config
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created line element
     */
    createSvg({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG line element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        // Calculate end point based on emission direction
        // For now, use a fixed length of 200 units as placeholder
        const beamLength = 200;
        const endPoint = {
            x: this.emissionPoint.x + this.emissionDirection.x * beamLength,
            y: this.emissionPoint.y + this.emissionDirection.y * beamLength
        };
        
        // Set line attributes
        this.element.setAttribute('x1', this.emissionPoint.x);
        this.element.setAttribute('y1', this.emissionPoint.y);
        this.element.setAttribute('x2', endPoint.x);
        this.element.setAttribute('y2', endPoint.y);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        
        // Add some visual styling for light beam appearance
        this.element.setAttribute('opacity', '0.8');
        this.element.setAttribute('stroke-linecap', 'round');
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }
    
    /**
     * Update the light beam's emission point
     * @param {Object} newEmissionPoint - New starting point {x, y}
     */
    updateEmissionPoint(newEmissionPoint) {
        this.emissionPoint = newEmissionPoint;
        this.updateBeamPath();
    }
    
    /**
     * Update the light beam's emission direction
     * @param {Object} newDirection - New direction vector {x, y}
     */
    updateEmissionDirection(newDirection) {
        this.emissionDirection = newDirection;
        this.updateBeamPath();
    }
    
    /**
     * Update the SVG line based on current emission point and direction
     */
    updateBeamPath() {
        if (!this.element) return;
        
        // Calculate end point based on current emission direction
        const beamLength = 200; // Placeholder length
        const endPoint = {
            x: this.emissionPoint.x + this.emissionDirection.x * beamLength,
            y: this.emissionPoint.y + this.emissionDirection.y * beamLength
        };
        
        // Update line attributes
        this.element.setAttribute('x1', this.emissionPoint.x);
        this.element.setAttribute('y1', this.emissionPoint.y);
        this.element.setAttribute('x2', endPoint.x);
        this.element.setAttribute('y2', endPoint.y);
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
