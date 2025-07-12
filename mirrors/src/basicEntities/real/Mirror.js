/**
 * @file Mirror.js - Mirror object with reflective and back sides
 * Main exports: Mirror
 */

/**
 * @class Mirror
 * Mirror object that renders as two parallel lines in SVG
 */
export class Mirror {
    /**
     * @param {Object} config
     * @param {number} config.x1 - Start x coordinate
     * @param {number} config.y1 - Start y coordinate
     * @param {number} config.x2 - End x coordinate
     * @param {number} config.y2 - End y coordinate
     * @param {number} [config.thickness=4] - Mirror thickness in pixels
     * @param {string} [config.reflectiveColor='#888'] - Color of reflective side
     * @param {string} [config.backColor='#000'] - Color of back side
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=true] - Whether the mirror can be dragged
     */
    constructor({ 
        x1, y1, x2, y2, 
        thickness = 3, 
        reflectiveColor = '#888', 
        backColor = '#000', 
        parentSvg, 
        draggable = true 
    }) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.thickness = thickness;
        this.reflectiveColor = reflectiveColor;
        this.backColor = backColor;
        this.draggable = draggable;

        // SVG elements
        this.reflectiveLine = null;
        this.backLine = null;
        this.group = null;
        
        // Drag state
        this.isDragging = false;
        this.dragStart = null;

        this.createSvg({ parentSvg });
        
        if (this.draggable) {
            this.setupDragging();
        }
    }

    /**
     * Create and return the SVG group containing both mirror lines
     * @param {Object} config
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @returns {SVGElement} The created group element
     */
    createSvg({ parentSvg }) {
        if (this.group) {
            return this.group;
        }
        
        this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        this.createMirrorLines();
        
        parentSvg.appendChild(this.group);
        return this.group;
    }

    /**
     * Create both mirror lines (reflective and back) and add them to the group
     */
    createMirrorLines() {
        const { reflectiveOffset, backOffset } = this.calculateLineOffsets();
        
        this.backLine = this.createLine({ offset: backOffset, color: this.backColor });
        this.reflectiveLine = this.createLine({ offset: reflectiveOffset, color: this.reflectiveColor });
        
        this.group.appendChild(this.backLine);
        this.group.appendChild(this.reflectiveLine);
    }

    /**
     * Create a single mirror line with the given offset and color
     * @param {Object} config
     * @param {Object} config.offset - {x1, y1, x2, y2} coordinates for the line
     * @param {string} config.color - Line color
     * @returns {SVGLineElement} The created line element
     */
    createLine({ offset, color }) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', offset.x1);
        line.setAttribute('y1', offset.y1);
        line.setAttribute('x2', offset.x2);
        line.setAttribute('y2', offset.y2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', this.thickness);
        return line;
    }

    /**
     * Calculate line offsets for both reflective and back lines
     * @returns {Object} {reflectiveOffset, backOffset} with x1,y1,x2,y2 for each line
     */
    calculateLineOffsets() {
        const { offsetX, offsetY } = this.calculatePerpendicularOffset();
        
        return {
            // Reflective side faces the right of the line
            reflectiveOffset: {
                x1: this.x1 - offsetX,
                y1: this.y1 - offsetY,
                x2: this.x2 - offsetX,
                y2: this.y2 - offsetY
            },
            // Back side faces the left of the line
            backOffset: {
                x1: this.x1 + offsetX,
                y1: this.y1 + offsetY,
                x2: this.x2 + offsetX,
                y2: this.y2 + offsetY
            }
        };
    }

    /**
     * Calculate perpendicular offset from center axis to position mirror lines
     * @returns {Object} {offsetX, offsetY} offset coordinates from center
     */
    calculatePerpendicularOffset() {
        // Calculate line direction vector
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate perpendicular vector pointing to the right
        // Right side = 90° clockwise rotation of direction vector
        const rightX = dy / length;
        const rightY = -dx / length;
        
        // Apply half thickness to offset from center axis
        return {
            offsetX: rightX * (this.thickness / 2),
            offsetY: rightY * (this.thickness / 2)
        };
    }

    /**
     * Set up drag interaction for the mirror
     */
    setupDragging() {
        if (!this.group) return;

        this.group.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const dx = e.clientX - this.dragStart.mouseX;
            const dy = e.clientY - this.dragStart.mouseY;

            // Update mirror coordinates
            this.x1 = this.dragStart.x1 + dx;
            this.y1 = this.dragStart.y1 + dy;
            this.x2 = this.dragStart.x2 + dx;
            this.y2 = this.dragStart.y2 + dy;

            this.updateLines();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.group.setAttribute('cursor', 'move');
    }

    /**
     * Update both mirror lines with current coordinates
     */
    updateLines() {
        if (!this.backLine || !this.reflectiveLine) return;

        const { reflectiveOffset, backOffset } = this.calculateLineOffsets();

        this.updateLinePosition({ line: this.backLine, offset: backOffset });
        this.updateLinePosition({ line: this.reflectiveLine, offset: reflectiveOffset });
    }

    /**
     * Update a single line element with new coordinates
     * @param {Object} config
     * @param {SVGLineElement} config.line - The line element to update
     * @param {Object} config.offset - {x1, y1, x2, y2} coordinates for the line
     */
    updateLinePosition({ line, offset }) {
        line.setAttribute('x1', offset.x1);
        line.setAttribute('y1', offset.y1);
        line.setAttribute('x2', offset.x2);
        line.setAttribute('y2', offset.y2);
    }
    
    /**
     * Remove the mirror from the DOM
     */
    destroy() {
        if (this.group && this.group.parentNode) {
            this.group.parentNode.removeChild(this.group);
        }
        this.reflectiveLine = null;
        this.backLine = null;
        this.group = null;
    }
}
