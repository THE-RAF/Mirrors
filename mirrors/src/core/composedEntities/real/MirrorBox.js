/**
 * @file MirrorBox.js - Composed entity for square mirror boxes
 * Creates a complete square box using 4 mirror entities and internal polygons/viewers
 */

import { Mirror } from '../../basicEntities/real/Mirror.js';
import { Polygon } from '../../basicEntities/real/Polygon.js';
import { Viewer } from '../../basicEntities/real/Viewer.js';


/**
 * @class MirrorBox
 * Composed entity that creates a square box made of 4 mirrors with internal polygons and viewers
 * Handles creation, positioning, and management of all mirror, polygon, and viewer components
 */
export class MirrorBox {
    /**
     * @param {Object} config
     * @param {number} config.x - Center X coordinate of the box
     * @param {number} config.y - Center Y coordinate of the box
     * @param {number} config.size - Side length of the square box
     * @param {SVGElement} config.parentSvg - SVG element for rendering mirrors
     * @param {Array} [config.polygons] - Array of polygon configurations to create inside the box
     * @param {Array} [config.viewers] - Array of viewer configurations to create inside the box
     * @param {boolean} [config.isDraggable=false] - Whether the box mirrors can be dragged
     * @param {boolean} [config.polygonsDraggable=true] - Whether polygons inside can be dragged
     * @param {boolean} [config.viewersDraggable=true] - Whether viewers inside can be dragged
     */
    constructor({ 
        x, y, size, parentSvg, 
        polygons = [], viewers = [], 
        isDraggable = false, polygonsDraggable = true, viewersDraggable = true 
    }) {
        this.centerX = x;
        this.centerY = y;
        this.size = size;
        this.parentSvg = parentSvg;
        this.isDraggable = isDraggable;
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
     * Create the 4 mirrors that form the square box
     */
    createMirrors() {
        const halfSize = this.size / 2;

        // Top mirror (horizontal)
        const topMirror = new Mirror({
            x1: this.centerX - halfSize,
            y1: this.centerY - halfSize,
            x2: this.centerX + halfSize,
            y2: this.centerY - halfSize,
            parentSvg: this.parentSvg,
            isDraggable: this.isDraggable
        });

        // Right mirror (vertical)
        const rightMirror = new Mirror({
            x1: this.centerX + halfSize,
            y1: this.centerY - halfSize,
            x2: this.centerX + halfSize,
            y2: this.centerY + halfSize,
            parentSvg: this.parentSvg,
            isDraggable: this.isDraggable
        });

        // Bottom mirror (horizontal)
        const bottomMirror = new Mirror({
            x1: this.centerX + halfSize,
            y1: this.centerY + halfSize,
            x2: this.centerX - halfSize,
            y2: this.centerY + halfSize,
            parentSvg: this.parentSvg,
            isDraggable: this.isDraggable
        });

        // Left mirror (vertical)
        const leftMirror = new Mirror({
            x1: this.centerX - halfSize,
            y1: this.centerY + halfSize,
            x2: this.centerX - halfSize,
            y2: this.centerY - halfSize,
            parentSvg: this.parentSvg,
            isDraggable: this.isDraggable
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
                isDraggable: this.polygonsDraggable
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
                isDraggable: this.viewersDraggable
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
     * @param {number} [config.size] - New size (optional)
     * @param {Array} [config.polygons] - New polygons configuration (optional)
     * @param {Array} [config.viewers] - New viewers configuration (optional)
     */
    update({ x, y, size, polygons, viewers }) {
        this.centerX = x;
        this.centerY = y;
        if (size !== undefined) {
            this.size = size;
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
