/**
 * @file ReflectionEngine.js - Manages virtual reflections of real objects
 * Main exports: ReflectionEngine
 */

import { VirtualObjectManager } from './VirtualObjectManager.js';

/**
 * @class ReflectionEngine
 * Handles creation, updating, and management of virtual polygon and viewer reflections
 */
export class ReflectionEngine {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual objects
     * @param {Function} [config.onVirtualPolygonClick] - Callback for virtual polygon clicks
     * @param {boolean} [config.virtualPolygonsClickable=true] - Whether virtual polygons should be clickable
     */
    constructor({ svgCanvas, onVirtualPolygonClick = null, virtualPolygonsClickable = true }) {
        this.virtualPolygons = [];
        this.virtualViewers = [];
        this.virtualMirrors = [];
        
        // Create manager for individual virtual objects
        this.objectManager = new VirtualObjectManager({
            svgCanvas,
            onVirtualPolygonClick,
            virtualPolygonsClickable
        });
    }

    /**
     * Create reflections of all polygons, viewers, and mirrors across all mirrors
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     */
    createReflections({ polygons, viewers = [], mirrors }) {
        // Create virtual polygons for each polygon-mirror combination
        polygons.forEach(polygon => {
            mirrors.forEach(mirror => {
                const virtualPolygon = this.objectManager.createVirtualPolygon({ polygon, mirror });
                this.virtualPolygons.push(virtualPolygon);
            });
        });

        // Create virtual viewers for each viewer-mirror combination
        viewers.forEach(viewer => {
            mirrors.forEach(mirror => {
                const virtualViewer = this.objectManager.createVirtualViewer({ viewer, mirror });
                this.virtualViewers.push(virtualViewer);
            });
        });

        // Create virtual mirrors for each mirror-mirror combination
        mirrors.forEach(mirror => {
            mirrors.forEach(reflectionMirror => {
                // Don't reflect a mirror on itself
                if (mirror !== reflectionMirror) {
                    const virtualMirror = this.objectManager.createVirtualMirror({ 
                        mirror, 
                        reflectionMirror 
                    });
                    this.virtualMirrors.push(virtualMirror);
                }
            });
        });
    }

    /**
     * Update all reflections based on current polygon, viewer, and mirror positions
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     */
    updateReflections({ polygons, viewers = [], mirrors }) {
        // Update all virtual polygons
        this.virtualPolygons.forEach(virtualPolygon => {
            this.objectManager.updateVirtualPolygon({ virtualPolygon });
        });

        // Update all virtual viewers
        this.virtualViewers.forEach(virtualViewer => {
            this.objectManager.updateVirtualViewer({ virtualViewer });
        });

        // Update all virtual mirrors
        this.virtualMirrors.forEach(virtualMirror => {
            this.objectManager.updateVirtualMirror({ virtualMirror });
        });
    }

    /**
     * Clear all existing virtual reflections
     */
    clearReflections() {
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualViewers.forEach(virtualViewer => virtualViewer.destroy());
        this.virtualMirrors.forEach(virtualMirror => virtualMirror.destroy());
        this.virtualPolygons = [];
        this.virtualViewers = [];
        this.virtualMirrors = [];
    }

    /**
     * Clean up all reflection resources
     */
    destroy() {
        this.clearReflections();
    }
}
