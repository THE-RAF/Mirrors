/**
 * @file MirrorBox.js - Composed entity for square mirror boxes
 * Creates a complete square box using 4 mirror entities and internal polygons/viewers
 */

import { Mirror } from '../../basicEntities/real/Mirror.js';
import { Polygon } from '../../basicEntities/real/Polygon.js';
import { Viewer } from '../../basicEntities/real/Viewer.js';


/**
 * @class MirrorBox
 * Composed entity that creates a rectangular box made of 4 mirrors with internal polygons and viewers
 * Handles creation, positioning, and management of all mirror, polygon, and viewer components
 */
export class MirrorBox {
    /**
     * @param {Object} config
     * @param {number} config.x - Center X coordinate of the box
     * @param {number} config.y - Center Y coordinate of the box
     * @param {number} config.boxWidth - Width of the rectangular box
     * @param {number} config.boxHeight - Height of the rectangular box
     * @param {number} [config.thickness=3] - Thickness of the mirror walls
     * @param {SVGElement} config.parentSvg - SVG element for rendering mirrors
     * @param {Array} [config.polygons] - Array of polygon configurations to create inside the box
     * @param {Array} [config.viewers] - Array of viewer configurations to create inside the box
     * @param {boolean} [config.polygonsDraggable=true] - Whether polygons inside can be dragged
     * @param {boolean} [config.viewersDraggable=true] - Whether viewers inside can be dragged
     */
    constructor({ 
        x, y, boxWidth, boxHeight, parentSvg, 
        polygons = [], viewers = [],
        polygonsDraggable = true, viewersDraggable = true,
        thickness = 3
    }) {
        this.centerX = x;
        this.centerY = y;
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.thickness = thickness;
        this.parentSvg = parentSvg;
        this.polygonsDraggable = polygonsDraggable;
        this.viewersDraggable = viewersDraggable;

        this.mirrors = [];
        this.polygons = [];
        this.viewers = [];
        this.createMirrors();
        this.createPolygons(polygons);
        this.createViewers(viewers);
    }

    /**
     * Create the 4 mirrors that form the rectangular box
     */
    createMirrors() {
        const halfWidth = this.boxWidth / 2;
        const halfHeight = this.boxHeight / 2;

        // Top mirror (horizontal)
        const topMirror = new Mirror({
            x1: this.centerX - halfWidth,
            y1: this.centerY - halfHeight,
            x2: this.centerX + halfWidth,
            y2: this.centerY - halfHeight,
            thickness: this.thickness,
            parentSvg: this.parentSvg,
            draggable: false
        });

        // Right mirror (vertical)
        const rightMirror = new Mirror({
            x1: this.centerX + halfWidth,
            y1: this.centerY - halfHeight,
            x2: this.centerX + halfWidth,
            y2: this.centerY + halfHeight,
            thickness: this.thickness,
            parentSvg: this.parentSvg,
            draggable: false
        });

        // Bottom mirror (horizontal)
        const bottomMirror = new Mirror({
            x1: this.centerX + halfWidth,
            y1: this.centerY + halfHeight,
            x2: this.centerX - halfWidth,
            y2: this.centerY + halfHeight,
            thickness: this.thickness,
            parentSvg: this.parentSvg,
            draggable: false
        });

        // Left mirror (vertical)
        const leftMirror = new Mirror({
            x1: this.centerX - halfWidth,
            y1: this.centerY + halfHeight,
            x2: this.centerX - halfWidth,
            y2: this.centerY - halfHeight,
            thickness: this.thickness,
            parentSvg: this.parentSvg,
            draggable: false
        });

        this.mirrors = [topMirror, rightMirror, bottomMirror, leftMirror];
    }

    /**
     * Create polygons inside the box
     * @param {Array} polygonConfigs - Array of polygon configurations
     */
    createPolygons(polygonConfigs) {
        polygonConfigs.forEach(config => {
            const polygon = new Polygon({
                vertices: config.vertices,
                fill: config.fill,
                parentSvg: this.parentSvg,
                draggable: this.polygonsDraggable
            });
            this.polygons.push(polygon);
        });
    }

    /**
     * Create viewers inside the box
     * @param {Array} viewerConfigs - Array of viewer configurations
     */
    createViewers(viewerConfigs) {
        viewerConfigs.forEach(config => {
            const viewer = new Viewer({
                x: config.x,
                y: config.y,
                radius: config.radius,
                fill: config.fill,
                parentSvg: this.parentSvg,
                draggable: this.viewersDraggable
            });
            this.viewers.push(viewer);
        });
    }

    /**
     * Get all mirrors in the box
     * @returns {Array<Mirror>} Array of mirror entities
     */
    getMirrors() {
        return this.mirrors;
    }

    /**
     * Get all polygons inside the box
     * @returns {Array<Polygon>} Array of polygon entities
     */
    getPolygons() {
        return this.polygons;
    }

    /**
     * Get all viewers inside the box
     * @returns {Array<Viewer>} Array of viewer entities
     */
    getViewers() {
        return this.viewers;
    }

    /**
     * Update the box position and size
     * @param {Object} config
     * @param {number} config.x - New center X coordinate
     * @param {number} config.y - New center Y coordinate
     * @param {number} [config.boxWidth] - New width (optional)
     * @param {number} [config.boxHeight] - New height (optional)
     * @param {Array} [config.polygons] - New polygons configuration (optional)
     * @param {Array} [config.viewers] - New viewers configuration (optional)
     */
    update({ x, y, boxWidth, boxHeight, polygons, viewers }) {
        this.centerX = x;
        this.centerY = y;
        if (boxWidth !== undefined) {
            this.boxWidth = boxWidth;
        }
        if (boxHeight !== undefined) {
            this.boxHeight = boxHeight;
        }

        // Destroy old mirrors, polygons, and viewers, create new ones
        this.destroy();
        this.createMirrors();
        if (polygons !== undefined) {
            this.createPolygons(polygons);
        }
        if (viewers !== undefined) {
            this.createViewers(viewers);
        }
    }

    /**
     * Clean up all mirror, polygon, and viewer resources
     */
    destroy() {
        this.mirrors.forEach(mirror => mirror.destroy());
        this.mirrors = [];
        
        this.polygons.forEach(polygon => polygon.destroy());
        this.polygons = [];
        
        this.viewers.forEach(viewer => viewer.destroy());
        this.viewers = [];
    }
}
