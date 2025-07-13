/**
 * @file ReflectionEngine.js - Manages virtual reflections of real objects
 * Main exports: ReflectionEngine
 */

import { VirtualPolygon } from '../basicEntities/virtual/VirtualPolygon.js';
import { VirtualViewer } from '../basicEntities/virtual/VirtualViewer.js';
import { reflectPolygonOverAxis } from '../../math/analyticalGeometry.js';

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
        this.svgCanvas = svgCanvas;
        this.virtualPolygons = [];
        this.virtualViewers = [];
        this.onVirtualPolygonClick = onVirtualPolygonClick;
        this.virtualPolygonsClickable = virtualPolygonsClickable;
    }

    /**
     * Create reflections of all polygons and viewers across all mirrors
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     */
    createReflections({ polygons, viewers = [], mirrors }) {
        // Reflect polygons
        polygons.forEach(polygon => {
            mirrors.forEach(mirror => {
                // Define mirror axis from mirror coordinates
                const axis = {
                    x1: mirror.x1,
                    y1: mirror.y1,
                    x2: mirror.x2,
                    y2: mirror.y2
                };
                
                // Reflect polygon vertices
                const reflectedVertices = reflectPolygonOverAxis({
                    polygon: polygon.vertices,
                    axis: axis
                });
                
                // Create virtual polygon for the reflection
                const virtualPolygon = new VirtualPolygon({
                    vertices: reflectedVertices,
                    fill: polygon.fill,
                    stroke: polygon.stroke,
                    strokeWidth: polygon.strokeWidth,
                    parentSvg: this.svgCanvas,
                    clickable: this.virtualPolygonsClickable,
                    onVirtualClick: this.onVirtualPolygonClick,
                    sourcePolygon: polygon,
                    sourceMirror: mirror
                });
                
                this.virtualPolygons.push(virtualPolygon);
            });
        });

        // Reflect viewers
        viewers.forEach(viewer => {
            mirrors.forEach(mirror => {
                // Define mirror axis from mirror coordinates
                const axis = {
                    x1: mirror.x1,
                    y1: mirror.y1,
                    x2: mirror.x2,
                    y2: mirror.y2
                };
                
                // Reflect viewer position (single point)
                const reflectedPoint = reflectPolygonOverAxis({
                    polygon: [{ x: viewer.x, y: viewer.y }],
                    axis: axis
                })[0];
                
                // Create virtual viewer for the reflection
                const virtualViewer = new VirtualViewer({
                    x: reflectedPoint.x,
                    y: reflectedPoint.y,
                    radius: viewer.radius,
                    fill: viewer.fill,
                    stroke: viewer.stroke,
                    strokeWidth: viewer.strokeWidth,
                    parentSvg: this.svgCanvas,
                    sourceViewer: viewer,
                    sourceMirror: mirror
                });
                
                this.virtualViewers.push(virtualViewer);
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
        // Update existing virtual polygons
        this.virtualPolygons.forEach(virtualPolygon => {
            const sourcePolygon = virtualPolygon.sourcePolygon;
            const sourceMirror = virtualPolygon.sourceMirror;
            
            if (sourcePolygon && sourceMirror) {
                // Define mirror axis from mirror coordinates
                const axis = {
                    x1: sourceMirror.x1,
                    y1: sourceMirror.y1,
                    x2: sourceMirror.x2,
                    y2: sourceMirror.y2
                };
                
                // Reflect polygon vertices
                const reflectedVertices = reflectPolygonOverAxis({
                    polygon: sourcePolygon.vertices,
                    axis: axis
                });
                
                // Update the virtual polygon's vertices and SVG
                virtualPolygon.vertices = reflectedVertices;
                virtualPolygon.updatePoints();
            }
        });

        // Update existing virtual viewers
        this.virtualViewers.forEach(virtualViewer => {
            const sourceViewer = virtualViewer.sourceViewer;
            const sourceMirror = virtualViewer.sourceMirror;
            
            if (sourceViewer && sourceMirror) {
                // Define mirror axis from mirror coordinates
                const axis = {
                    x1: sourceMirror.x1,
                    y1: sourceMirror.y1,
                    x2: sourceMirror.x2,
                    y2: sourceMirror.y2
                };
                
                // Reflect viewer position (single point)
                const reflectedPoint = reflectPolygonOverAxis({
                    polygon: [{ x: sourceViewer.x, y: sourceViewer.y }],
                    axis: axis
                })[0];
                
                // Update the virtual viewer's position and SVG
                virtualViewer.x = reflectedPoint.x;
                virtualViewer.y = reflectedPoint.y;
                if (virtualViewer.element) {
                    virtualViewer.element.setAttribute('cx', reflectedPoint.x);
                    virtualViewer.element.setAttribute('cy', reflectedPoint.y);
                }
            }
        });
    }

    /**
     * Clear all existing virtual reflections
     */
    clearReflections() {
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualViewers.forEach(virtualViewer => virtualViewer.destroy());
        this.virtualPolygons = [];
        this.virtualViewers = [];
    }

    /**
     * Clean up all reflection resources
     */
    destroy() {
        this.clearReflections();
    }
}
