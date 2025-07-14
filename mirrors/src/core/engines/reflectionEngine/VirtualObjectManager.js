/**
 * @file VirtualObjectManager.js - Manages individual virtual object operations
 * Main exports: VirtualObjectManager
 */

import { VirtualPolygon } from '../../basicEntities/virtual/VirtualPolygon.js';
import { VirtualViewer } from '../../basicEntities/virtual/VirtualViewer.js';
import { reflectPolygonOverAxis } from '../../../math/analyticalGeometry.js';

/**
 * @class VirtualObjectManager
 * Handles creation and updates of individual virtual polygons and viewers
 */
export class VirtualObjectManager {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual objects
     * @param {Function} [config.onVirtualPolygonClick] - Callback for virtual polygon clicks
     * @param {boolean} [config.virtualPolygonsClickable=true] - Whether virtual polygons should be clickable
     */
    constructor({ svgCanvas, onVirtualPolygonClick = null, virtualPolygonsClickable = true }) {
        this.svgCanvas = svgCanvas;
        this.onVirtualPolygonClick = onVirtualPolygonClick;
        this.virtualPolygonsClickable = virtualPolygonsClickable;
    }

    /**
     * Create a single virtual polygon from a real polygon and mirror
     * @param {Object} config
     * @param {Object} config.polygon - Real polygon object to reflect
     * @param {Object} config.mirror - Mirror object to reflect across
     * @returns {VirtualPolygon} The created virtual polygon reflection
     */
    createVirtualPolygon({ polygon, mirror }) {
        // Define mirror axis from mirror coordinates
        const axis = {
            x1: mirror.x1,
            y1: mirror.y1,
            x2: mirror.x2,
            y2: mirror.y2
        };
        
        // Reflect polygon vertices using existing math function
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
        
        return virtualPolygon;
    }

    /**
     * Create a single virtual viewer from a real viewer and mirror
     * @param {Object} config
     * @param {Object} config.viewer - Real viewer object to reflect
     * @param {Object} config.mirror - Mirror object to reflect across
     * @returns {VirtualViewer} The created virtual viewer reflection
     */
    createVirtualViewer({ viewer, mirror }) {
        // Define mirror axis from mirror coordinates
        const axis = {
            x1: mirror.x1,
            y1: mirror.y1,
            x2: mirror.x2,
            y2: mirror.y2
        };
        
        // Reflect viewer position using existing math function
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
        
        return virtualViewer;
    }

    /**
     * Update a single virtual polygon based on current positions
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - Virtual polygon to update
     */
    updateVirtualPolygon({ virtualPolygon }) {
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
            
            // Reflect polygon vertices using existing math function
            const reflectedVertices = reflectPolygonOverAxis({
                polygon: sourcePolygon.vertices,
                axis: axis
            });
            
            // Update the virtual polygon's vertices and SVG
            virtualPolygon.vertices = reflectedVertices;
            virtualPolygon.updatePoints();
        }
    }

    /**
     * Update a single virtual viewer based on current positions
     * @param {Object} config
     * @param {VirtualViewer} config.virtualViewer - Virtual viewer to update
     */
    updateVirtualViewer({ virtualViewer }) {
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
            
            // Reflect viewer position using existing math function
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
    }
}
