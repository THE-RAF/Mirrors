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
     * @param {boolean} [config.animated=true] - Whether to animate beam creation
     * @param {number} [config.animationDuration=1000] - Duration of creation animation in milliseconds
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    constructor({ 
        emissionPoint,
        directorVector,
        maxLength = 800,
        points = null,
        stroke = '#f5e911', 
        strokeWidth = 2,
        animated = true,
        animationDuration = 1000,
        parentSvg 
    }) {
        this.emissionPoint = emissionPoint;
        this.directorVector = directorVector;
        this.maxLength = maxLength;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.animated = animated;
        this.animationDuration = animationDuration;
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
        
        // Ensure glow filter exists
        this.createGlowFilter(parentSvg);
        
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
        this.element.setAttribute('stroke-linejoin', 'round');
        this.element.setAttribute('opacity', 0.9);
        
        // Apply subtle glow effect
        this.element.setAttribute('filter', 'url(#lightBeamGlow)');

        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        // Apply animation if enabled
        if (this.animated) {
            this.animateBeamCreation();
        }
        
        return this.element;
    }
    
    /**
     * Animate beam creation using stroke-dasharray technique with ease-in-out timing
     */
    animateBeamCreation() {
        if (!this.element) return;
        
        // Calculate total path length
        const totalLength = this.element.getTotalLength();
        
        // Set initial state: completely hidden with dashed line
        this.element.style.strokeDasharray = totalLength;
        this.element.style.strokeDashoffset = totalLength;
        
        // Animate the stroke-dashoffset from totalLength to 0
        this.element.animate([
            { strokeDashoffset: totalLength },
            { strokeDashoffset: 0 }
        ], {
            duration: this.animationDuration,
            easing: 'ease-in-out',
            fill: 'forwards'
        }).addEventListener('finish', () => {
            // Clean up animation styles after completion
            this.element.style.strokeDasharray = '';
            this.element.style.strokeDashoffset = '';
        });
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
    
    /**
     * Create a subtle glow filter for light beams (only creates once per SVG)
     * @param {SVGElement} parentSvg - Parent SVG container
     */
    createGlowFilter(parentSvg) {
        // Check if filter already exists
        if (parentSvg.querySelector('#lightBeamGlow')) {
            return;
        }
        
        // Create defs element if it doesn't exist
        let defs = parentSvg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            parentSvg.insertBefore(defs, parentSvg.firstChild);
        }
        
        // Create filter element
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'lightBeamGlow');
        filter.setAttribute('x', '-50%');
        filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%');
        filter.setAttribute('height', '200%');
        
        // Create Gaussian blur for glow effect
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '2');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        
        // Merge the blur with the original
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
    }
}
