/**
 * @file VirtualMirrorBox.js - Virtual composed entity for rectangular mirror boxes
 * Creates a complete virtual rectangular box using 4 virtual mirror entities and internal virtual polygons/viewers
 */

import { VirtualMirror } from '../../basicEntities/virtual/VirtualMirror.js';
import { VirtualPolygon } from '../../basicEntities/virtual/VirtualPolygon.js';
import { VirtualViewer } from '../../basicEntities/virtual/VirtualViewer.js';

/**
 * @class VirtualMirrorBox
 * Virtual composed entity that creates a rectangular box made of 4 virtual mirrors with internal virtual polygons and viewers
 * Represents a reflection of a real MirrorBox with distinctive virtual styling
 */
export class VirtualMirrorBox {
    /**
     * @param {Object} config
     * @param {number} config.x - Center X coordinate of the virtual box
     * @param {number} config.y - Center Y coordinate of the virtual box
     * @param {number} config.boxWidth - Width of the rectangular virtual box
     * @param {number} config.boxHeight - Height of the rectangular virtual box
     * @param {SVGElement} config.parentSvg - SVG element for rendering virtual mirrors
     * @param {Array} [config.polygons] - Array of polygon configurations to create inside the virtual box
     * @param {Array} [config.viewers] - Array of viewer configurations to create inside the virtual box
     * @param {Object} [config.sourceMirrorBox] - Reference to the real MirrorBox this virtual box reflects
     * @param {Object} [config.reflectionMirror] - Reference to the mirror that creates this reflection
     * @param {number} [config.opacity=0.3] - Opacity level for all virtual components
     */
    constructor({ 
        x, y, boxWidth, boxHeight, parentSvg, 
        polygons = [], viewers = [],
        sourceMirrorBox = null, reflectionMirror = null,
        opacity = 0.3
    }) {
        this.centerX = x;
        this.centerY = y;
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.parentSvg = parentSvg;
        this.sourceMirrorBox = sourceMirrorBox;
        this.reflectionMirror = reflectionMirror;
        this.opacity = opacity;

        this.virtualMirrors = [];
        this.virtualPolygons = [];
        this.virtualViewers = [];
        
        this.createVirtualMirrors();
        this.createVirtualPolygons(polygons);
        this.createVirtualViewers(viewers);
    }

    /**
     * Create the 4 virtual mirrors that form the rectangular virtual box
     */
    createVirtualMirrors() {
        const halfWidth = this.boxWidth / 2;
        const halfHeight = this.boxHeight / 2;

        // Top virtual mirror (horizontal)
        const topMirror = new VirtualMirror({
            x1: this.centerX - halfWidth,
            y1: this.centerY - halfHeight,
            x2: this.centerX + halfWidth,
            y2: this.centerY - halfHeight,
            parentSvg: this.parentSvg,
            sourceMirror: this.sourceMirrorBox?.getMirrors()[0],
            reflectionMirror: this.reflectionMirror,
            opacity: this.opacity
        });

        // Right virtual mirror (vertical)
        const rightMirror = new VirtualMirror({
            x1: this.centerX + halfWidth,
            y1: this.centerY - halfHeight,
            x2: this.centerX + halfWidth,
            y2: this.centerY + halfHeight,
            parentSvg: this.parentSvg,
            sourceMirror: this.sourceMirrorBox?.getMirrors()[1],
            reflectionMirror: this.reflectionMirror,
            opacity: this.opacity
        });

        // Bottom virtual mirror (horizontal)
        const bottomMirror = new VirtualMirror({
            x1: this.centerX + halfWidth,
            y1: this.centerY + halfHeight,
            x2: this.centerX - halfWidth,
            y2: this.centerY + halfHeight,
            parentSvg: this.parentSvg,
            sourceMirror: this.sourceMirrorBox?.getMirrors()[2],
            reflectionMirror: this.reflectionMirror,
            opacity: this.opacity
        });

        // Left virtual mirror (vertical)
        const leftMirror = new VirtualMirror({
            x1: this.centerX - halfWidth,
            y1: this.centerY + halfHeight,
            x2: this.centerX - halfWidth,
            y2: this.centerY - halfHeight,
            parentSvg: this.parentSvg,
            sourceMirror: this.sourceMirrorBox?.getMirrors()[3],
            reflectionMirror: this.reflectionMirror,
            opacity: this.opacity
        });

        this.virtualMirrors = [topMirror, rightMirror, bottomMirror, leftMirror];
    }

    /**
     * Create virtual polygons inside the virtual box
     * @param {Array} polygonConfigs - Array of polygon configurations
     */
    createVirtualPolygons(polygonConfigs) {
        polygonConfigs.forEach((config, index) => {
            const virtualPolygon = new VirtualPolygon({
                vertices: config.vertices,
                fill: config.fill,
                parentSvg: this.parentSvg,
                sourcePolygon: this.sourceMirrorBox?.getPolygons()[index],
                sourceMirror: this.reflectionMirror,
                opacity: this.opacity
            });
            this.virtualPolygons.push(virtualPolygon);
        });
    }

    /**
     * Create virtual viewers inside the virtual box
     * @param {Array} viewerConfigs - Array of viewer configurations
     */
    createVirtualViewers(viewerConfigs) {
        viewerConfigs.forEach((config, index) => {
            const virtualViewer = new VirtualViewer({
                x: config.x,
                y: config.y,
                radius: config.radius,
                fill: config.fill,
                parentSvg: this.parentSvg,
                sourceViewer: this.sourceMirrorBox?.getViewers()[index],
                sourceMirror: this.reflectionMirror,
                opacity: this.opacity
            });
            this.virtualViewers.push(virtualViewer);
        });
    }

    /**
     * Get all virtual mirrors in the box
     * @returns {Array<VirtualMirror>} Array of virtual mirror entities
     */
    getVirtualMirrors() {
        return this.virtualMirrors;
    }

    /**
     * Get all virtual polygons inside the box
     * @returns {Array<VirtualPolygon>} Array of virtual polygon entities
     */
    getVirtualPolygons() {
        return this.virtualPolygons;
    }

    /**
     * Get all virtual viewers inside the box
     * @returns {Array<VirtualViewer>} Array of virtual viewer entities
     */
    getVirtualViewers() {
        return this.virtualViewers;
    }

    /**
     * Update the virtual box position and size
     * @param {Object} config
     * @param {number} config.x - New center X coordinate
     * @param {number} config.y - New center Y coordinate
     * @param {number} [config.boxWidth] - New width (optional)
     * @param {number} [config.boxHeight] - New height (optional)
     * @param {Array} [config.polygons] - New virtual polygons configuration (optional)
     * @param {Array} [config.viewers] - New virtual viewers configuration (optional)
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

        // Destroy old virtual entities, create new ones
        this.destroy();
        this.createVirtualMirrors();
        if (polygons !== undefined) {
            this.createVirtualPolygons(polygons);
        }
        if (viewers !== undefined) {
            this.createVirtualViewers(viewers);
        }
    }

    /**
     * Clean up all virtual mirror, polygon, and viewer resources
     */
    destroy() {
        this.virtualMirrors.forEach(mirror => mirror.destroy());
        this.virtualMirrors = [];
        
        this.virtualPolygons.forEach(polygon => polygon.destroy());
        this.virtualPolygons = [];
        
        this.virtualViewers.forEach(viewer => viewer.destroy());
        this.virtualViewers = [];
    }
}
