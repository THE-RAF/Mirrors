/**
 * @file BoxReflectionEngine.js - Engine for reflecting entire mirror boxes
 * Main exports: BoxReflectionEngine
 */

import { VirtualObjectManager } from '../reflectionEngine/VirtualObjectManager.js';
import { VirtualMirrorBox } from '../../composedEntities/virtual/VirtualMirrorBox.js';
import { reflectPolygonOverAxis } from '../../../math/analyticalGeometry.js';

/**
 * @class BoxReflectionEngine
 * Specialized engine for creating reflections of entire mirror boxes
 * Uses VirtualObjectManager to handle individual component reflections
 */
export class BoxReflectionEngine {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual objects
     * @param {Function} [config.onVirtualPolygonClick] - Callback for virtual polygon clicks
     * @param {boolean} [config.virtualPolygonsClickable=true] - Whether virtual polygons should be clickable
     */
    constructor({ svgCanvas, onVirtualPolygonClick = null, virtualPolygonsClickable = true }) {
        this.svgCanvas = svgCanvas;
        this.virtualObjectManager = new VirtualObjectManager({
            svgCanvas,
            onVirtualPolygonClick,
            virtualPolygonsClickable
        });
    }

    /**
     * Reflect an entire MirrorBox across a mirror to create a VirtualMirrorBox
     * @param {Object} config
     * @param {MirrorBox} config.sourceBox - The real MirrorBox to reflect
     * @param {Mirror} config.reflectionMirror - The mirror to reflect across
     * @param {number} [config.opacity=0.3] - Opacity for the virtual box components
     * @returns {VirtualMirrorBox} The created virtual mirror box reflection
     */
    reflectBox({ sourceBox, reflectionMirror, opacity = 0.3 }) {
        // Get all components from the source box
        const sourceMirrors = sourceBox.getMirrors();
        const sourcePolygons = sourceBox.getPolygons();
        const sourceViewers = sourceBox.getViewers();

        // Reflect each mirror to determine the virtual box boundaries
        const virtualMirrors = sourceMirrors.map(mirror => 
            this.virtualObjectManager.createVirtualMirror({
                mirror,
                reflectionMirror
            })
        );

        // Reflect each polygon
        const virtualPolygons = sourcePolygons.map(polygon => 
            this.virtualObjectManager.createVirtualPolygon({
                polygon,
                mirror: reflectionMirror
            })
        );

        // Reflect each viewer
        const virtualViewers = sourceViewers.map(viewer => 
            this.virtualObjectManager.createVirtualViewer({
                viewer,
                mirror: reflectionMirror
            })
        );

        // Calculate the reflected box center position
        const reflectedCenter = this.reflectPoint({
            point: { x: sourceBox.centerX, y: sourceBox.centerY },
            mirror: reflectionMirror
        });

        // Create and return a VirtualMirrorBox that contains all the reflected components
        // Note: We don't use the VirtualMirrorBox constructor's automatic creation
        // because we already have the individual virtual components
        const virtualBox = new VirtualMirrorBox({
            x: reflectedCenter.x,
            y: reflectedCenter.y,
            boxWidth: sourceBox.boxWidth,
            boxHeight: sourceBox.boxHeight,
            thickness: sourceBox.thickness,
            parentSvg: this.svgCanvas,
            polygons: [], // Empty - we'll manually assign the reflected components
            viewers: [],  // Empty - we'll manually assign the reflected components
            sourceMirrorBox: sourceBox,
            reflectionMirror: reflectionMirror,
            opacity: opacity
        });

        // Manually replace the auto-created components with our reflected ones
        // First destroy the auto-created ones
        virtualBox.virtualMirrors.forEach(mirror => mirror.destroy());
        virtualBox.virtualPolygons.forEach(polygon => polygon.destroy());
        virtualBox.virtualViewers.forEach(viewer => viewer.destroy());

        // Assign our reflected components
        virtualBox.virtualMirrors = virtualMirrors;
        virtualBox.virtualPolygons = virtualPolygons;
        virtualBox.virtualViewers = virtualViewers;

        return virtualBox;
    }

    /**
     * Helper method to reflect a point across a mirror
     * @param {Object} config
     * @param {Object} config.point - Point to reflect {x, y}
     * @param {Object} config.mirror - Mirror to reflect across
     * @returns {Object} Reflected point {x, y}
     */
    reflectPoint({ point, mirror }) {
        const axis = {
            x1: mirror.x1,
            y1: mirror.y1,
            x2: mirror.x2,
            y2: mirror.y2
        };

        const reflectedPoints = reflectPolygonOverAxis({
            polygon: [point],
            axis: axis
        });

        return reflectedPoints[0];
    }

    /**
     * Update all virtual components of a reflected box when the source changes
     * @param {Object} config
     * @param {VirtualMirrorBox} config.virtualBox - The virtual box to update
     */
    updateReflectedBox({ virtualBox }) {
        // Update all virtual mirrors
        virtualBox.virtualMirrors.forEach(virtualMirror => {
            this.virtualObjectManager.updateVirtualMirror({ virtualMirror });
        });

        // Update all virtual polygons
        virtualBox.virtualPolygons.forEach(virtualPolygon => {
            this.virtualObjectManager.updateVirtualPolygon({ virtualPolygon });
        });

        // Update all virtual viewers
        virtualBox.virtualViewers.forEach(virtualViewer => {
            this.virtualObjectManager.updateVirtualViewer({ virtualViewer });
        });

        // Update the virtual box center position
        const sourceBox = virtualBox.sourceMirrorBox;
        const reflectionMirror = virtualBox.reflectionMirror;
        
        if (sourceBox && reflectionMirror) {
            const reflectedCenter = this.reflectPoint({
                point: { x: sourceBox.centerX, y: sourceBox.centerY },
                mirror: reflectionMirror
            });

            virtualBox.centerX = reflectedCenter.x;
            virtualBox.centerY = reflectedCenter.y;
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        // The VirtualObjectManager doesn't need explicit cleanup
        // Individual virtual objects are cleaned up by their containers
    }
}