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
     * @param {Object} config.emissionPoint - Starting point {x, y} for ray tracing
     * @param {Object} config.directorVector - Direction vector {x, y} for ray tracing
     * @param {number} [config.maxLength=800] - Maximum ray length for ray tracing
     * @param {Array} [config.points] - Array of {x, y} points defining the light beam path (calculated if not provided)
     * @param {string} [config.stroke='#ffff00'] - Stroke color of the light beam
     * @param {number} [config.strokeWidth=2] - Stroke width of the light beam
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    constructor({ 
        emissionPoint,
        directorVector,
        maxLength = 800,
        points = null,
        stroke = '#f5e911', 
        strokeWidth = 2, 
        parentSvg 
    }) {
        this.emissionPoint = emissionPoint;
        this.directorVector = directorVector;
        this.maxLength = maxLength;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.element = null;
        
        // If points not provided, create a simple straight line
        this.points = points || this.createDefaultPoints();
        
        this.createSvg({ parentSvg });
    }
    
    /**
     * Create default points as a straight line from emission point in director vector direction
     * @returns {Array} Array of two points defining a straight line
     */
    createDefaultPoints() {
        return [
            this.emissionPoint,
            {
                x: this.emissionPoint.x + this.directorVector.x * this.maxLength,
                y: this.emissionPoint.y + this.directorVector.y * this.maxLength
            }
        ];
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
