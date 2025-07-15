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
     * @param {string} [config.centerColor='#000'] - Color of center line
     * @param {SVGElement} config.parentSvg - Parent SVG container
     * @param {boolean} [config.draggable=true] - Whether the mirror can be dragged
     */
    constructor({ 
        x1, y1, x2, y2, 
        thickness = 3, 
        reflectiveColor = '#888', 
        centerColor = '#000', 
        parentSvg, 
        draggable = true 
    }) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.thickness = thickness;
        this.reflectiveColor = reflectiveColor;
        this.centerColor = centerColor;
        this.draggable = draggable;

        // Internal configuration for 3-line mirror rendering
        this.centerThicknessRatio = 0.55; // Center line is 55% of total thickness
        this.reflectiveThicknessRatio = 0.45; // Each reflective line is 45% of total thickness
        this.reflectiveOffsetRatio = 1; // Distance from center as ratio of total thickness

        // SVG elements
        this.centerLine = null;
        this.reflectiveLine1 = null;
        this.reflectiveLine2 = null;
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
     * Create all three mirror lines (center + two reflective sides) and add them to the group
     */
    createMirrorLines() {
        const { centerOffset, reflectiveOffset1, reflectiveOffset2 } = this.calculateLineOffsets();
        
        // Create lines in back-to-front order for proper rendering
        this.reflectiveLine1 = this.createLine({ 
            offset: reflectiveOffset1, 
            color: this.reflectiveColor, 
            thickness: this.thickness * this.reflectiveThicknessRatio 
        });
        this.reflectiveLine2 = this.createLine({ 
            offset: reflectiveOffset2, 
            color: this.reflectiveColor, 
            thickness: this.thickness * this.reflectiveThicknessRatio 
        });
        this.centerLine = this.createLine({ 
            offset: centerOffset, 
            color: this.centerColor, 
            thickness: this.thickness * this.centerThicknessRatio 
        });
        
        this.group.appendChild(this.reflectiveLine1);
        this.group.appendChild(this.reflectiveLine2);
        this.group.appendChild(this.centerLine);
    }

    /**
     * Create a single mirror line with the given offset, color, and thickness
     * @param {Object} config
     * @param {Object} config.offset - {x1, y1, x2, y2} coordinates for the line
     * @param {string} config.color - Line color
     * @param {number} config.thickness - Line thickness
     * @returns {SVGLineElement} The created line element
     */
    createLine({ offset, color, thickness }) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', offset.x1);
        line.setAttribute('y1', offset.y1);
        line.setAttribute('x2', offset.x2);
        line.setAttribute('y2', offset.y2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', thickness);
        return line;
    }

    /**
     * Calculate line offsets for center and both reflective lines
     * @returns {Object} {centerOffset, reflectiveOffset1, reflectiveOffset2} with x1,y1,x2,y2 for each line
     */
    calculateLineOffsets() {
        const { offsetX, offsetY } = this.calculatePerpendicularOffset();
        
        return {
            // Center line (black, thicker)
            centerOffset: {
                x1: this.x1,
                y1: this.y1,
                x2: this.x2,
                y2: this.y2
            },
            // First reflective side (gray, thinner)
            reflectiveOffset1: {
                x1: this.x1 - offsetX,
                y1: this.y1 - offsetY,
                x2: this.x2 - offsetX,
                y2: this.y2 - offsetY
            },
            // Second reflective side (gray, thinner)
            reflectiveOffset2: {
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
        
        // Apply offset distance from center axis
        return {
            offsetX: rightX * (this.thickness * this.reflectiveOffsetRatio / 2),
            offsetY: rightY * (this.thickness * this.reflectiveOffsetRatio / 2)
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
     * Update all three mirror lines with current coordinates
     */
    updateLines() {
        if (!this.centerLine || !this.reflectiveLine1 || !this.reflectiveLine2) return;

        const { centerOffset, reflectiveOffset1, reflectiveOffset2 } = this.calculateLineOffsets();

        this.updateLinePosition({ line: this.centerLine, offset: centerOffset });
        this.updateLinePosition({ line: this.reflectiveLine1, offset: reflectiveOffset1 });
        this.updateLinePosition({ line: this.reflectiveLine2, offset: reflectiveOffset2 });
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
        this.centerLine = null;
        this.reflectiveLine1 = null;
        this.reflectiveLine2 = null;
        this.group = null;
    }
}
