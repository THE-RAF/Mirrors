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
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=true] - Whether the polygon can be dragged
     */
    constructor({ vertices, fill = '#ff6b6b', stroke = '#333', strokeWidth = 2, parentSvg, draggable = true }) {
        this.vertices = vertices;
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
        
        // Set cursor based on draggable state
        if (this.draggable) {
            this.element.setAttribute('cursor', 'move');
        }
        
        // Add to parent SVG
        parentSvg.appendChild(this.element);
        
        return this.element;
    }

    /**
     * Set up drag interaction for the polygon
     */
    setupDragging() {
        if (!this.element) return;

        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                vertices: this.vertices.map(v => ({ ...v }))
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const dx = e.clientX - this.dragStart.mouseX;
            const dy = e.clientY - this.dragStart.mouseY;

            // Update vertices with drag offset
            this.vertices = this.dragStart.vertices.map(vertex => ({
                x: vertex.x + dx,
                y: vertex.y + dy
            }));

            this.updatePoints();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    /**
     * Update the SVG points attribute with current vertices
     */
    updatePoints() {
        if (!this.element) return;

        const pointsString = this.vertices
            .map(vertex => `${vertex.x},${vertex.y}`)
            .join(' ');
        
        this.element.setAttribute('points', pointsString);
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
