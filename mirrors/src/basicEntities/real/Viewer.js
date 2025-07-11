/**
 * @file Viewer.js - Viewer object for representing a point of view
 * Main exports: Viewer
 */

/**
 * @class Viewer
 * Simple circular viewer object that renders as a circle
 */
export class Viewer {
    /**
     * @param {Object} config
     * @param {number} config.x - X coordinate of the viewer center
     * @param {number} config.y - Y coordinate of the viewer center
     * @param {number} [config.radius=8] - Radius of the viewer circle
     * @param {string} [config.fill='#4a90e2'] - Fill color of the viewer (default blue)
     * @param {string} [config.stroke='#333'] - Stroke color
     * @param {number} [config.strokeWidth=2] - Stroke width
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=true] - Whether the viewer can be dragged
     */
    constructor({ 
        x, 
        y, 
        radius = 12, 
        fill = '#4a90e2', 
        stroke = '#333', 
        strokeWidth = 2, 
        parentSvg, 
        draggable = true 
    }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.element = null;
        this.draggable = draggable;
        
        // Drag state
        this.isDragging = false;
        this.dragStart = null;

        this.createSvg({ parentSvg });
        
        if (this.draggable) {
            this.setupDragging();
        }
    }
    
    /**
     * Create and return the SVG circle element
     * @param {Object} config
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created circle element
     */
    createSvg({ parentSvg }) {
        if (this.element) {
            return this.element;
        }
        
        // Create SVG circle element
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        // Set attributes
        this.element.setAttribute('cx', this.x);
        this.element.setAttribute('cy', this.y);
        this.element.setAttribute('r', this.radius);
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke', this.stroke);
        this.element.setAttribute('stroke-width', this.strokeWidth);
        
        // Set cursor based on draggable state
        if (this.draggable) {
            this.element.setAttribute('cursor', 'move');
        }
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }

    /**
     * Set up drag interaction for the viewer
     */
    setupDragging() {
        if (!this.element) return;

        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                x: this.x,
                y: this.y
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const dx = e.clientX - this.dragStart.mouseX;
            const dy = e.clientY - this.dragStart.mouseY;

            // Update position with drag offset
            this.x = this.dragStart.x + dx;
            this.y = this.dragStart.y + dy;

            this.updatePosition();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    /**
     * Update the SVG circle position
     */
    updatePosition() {
        if (!this.element) return;

        this.element.setAttribute('cx', this.x);
        this.element.setAttribute('cy', this.y);
    }
    
    /**
     * Remove the viewer from the DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
