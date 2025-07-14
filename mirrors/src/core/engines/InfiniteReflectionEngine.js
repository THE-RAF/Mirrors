/**
 * @file InfiniteReflectionEngine.js - Handles infinite mirror reflections
 * 
 * ⚠️  EXPERIMENTAL FEATURE ⚠️
 * This engine is experimental and may introduce bugs, performance issues or incorrect behavior.
 * It implements complex recursive reflection algorithms that are still being refined.
 * Use with caution in production environments.
 * 
 * Main exports: InfiniteReflectionEngine
 */

import { VirtualPolygon } from '../basicEntities/virtual/VirtualPolygon.js';
import { VirtualViewer } from '../basicEntities/virtual/VirtualViewer.js';
import { reflectPolygonOverAxis } from '../../math/analyticalGeometry.js';

/**
 * @class InfiniteReflectionEngine
 * 
 * ⚠️  EXPERIMENTAL ENGINE ⚠️
 * 
 * Specialized engine for creating and managing infinite mirror reflections.
 * This is an experimental feature that implements complex recursive algorithms.
 * 
 * KNOWN LIMITATIONS:
 * - High computational complexity
 * - May cause performance issues with many objects or deep reflections
 * - Memory usage grows exponentially with reflection depth
 * - Some edge cases with overlapping mirrors may produce unexpected results
 * 
 * RECOMMENDED USAGE:
 * - Keep maxDepth ≤ 4 for good performance
 * - Test thoroughly before using in production
 * 
 * Completely separate from the basic ReflectionEngine for modularity and safety.
 */
export class InfiniteReflectionEngine {
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
        
        // Performance tracking
        this.lastUpdateTime = 0;
        this.isEnabled = false;
    }

    /**
     * Create infinite reflections of all polygons and viewers across all mirrors
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {Object} [config.infiniteConfig] - Infinite reflection configuration
     */
    createInfiniteReflections({ polygons, viewers = [], mirrors, infiniteConfig = {} }) {
        const {
            maxDepth = 3,
            fadeRate = 0.7,
            minOpacity = 0.1
        } = infiniteConfig;

        // Clear existing reflections first
        this.clearReflections();
        this.isEnabled = true;

        // Performance optimization: skip if no mirrors
        if (mirrors.length === 0) return;

        // Create layer 0 references (real objects)
        const objectLayers = [
            {
                polygons: polygons.map(p => ({ entity: p, opacity: 1.0, isReal: true })),
                viewers: viewers.map(v => ({ entity: v, opacity: 1.0, isReal: true }))
            }
        ];

        // Generate reflections layer by layer
        for (let depth = 1; depth <= maxDepth; depth++) {
            const currentOpacity = Math.pow(fadeRate, depth);
            
            // Skip if opacity too low
            if (currentOpacity < minOpacity) break;

            const prevLayer = objectLayers[depth - 1];
            const newLayer = { polygons: [], viewers: [] };

            // Reflect all objects from previous layer
            this._reflectPolygonsFromLayer({ 
                prevLayer, 
                newLayer, 
                mirrors, 
                fadeRate, 
                depth 
            });

            this._reflectViewersFromLayer({ 
                prevLayer, 
                newLayer, 
                mirrors, 
                fadeRate, 
                depth 
            });

            objectLayers.push(newLayer);
            
            // Performance check: break if too many objects
            if (this.virtualPolygons.length > 1000) {
                break;
            }
        }
    }

    /**
     * Reflect polygons from previous layer
     * @private
     */
    _reflectPolygonsFromLayer({ prevLayer, newLayer, mirrors, fadeRate, depth }) {
        prevLayer.polygons.forEach(({ entity: sourcePolygon, opacity: sourceOpacity, isReal }) => {
            mirrors.forEach(sourceMirror => {
                // Skip self-reflection for real objects with their own mirror
                if (isReal && this._isSelfReflection(sourcePolygon, sourceMirror)) return;

                const reflectedVertices = this._reflectVertices(sourcePolygon.vertices, sourceMirror);
                const newOpacity = sourceOpacity * fadeRate;

                // Create virtual polygon
                const virtualPolygon = new VirtualPolygon({
                    vertices: reflectedVertices,
                    fill: sourcePolygon.fill,
                    stroke: sourcePolygon.stroke,
                    strokeWidth: sourcePolygon.strokeWidth,
                    parentSvg: this.svgCanvas,
                    clickable: this.virtualPolygonsClickable,
                    onVirtualClick: this.onVirtualPolygonClick,
                    sourceRealPolygon: isReal ? sourcePolygon : sourcePolygon.sourcePolygon,
                    sourceMirror: sourceMirror,
                    opacity: newOpacity
                });

                // Add metadata for debugging and optimization
                virtualPolygon._reflectionDepth = depth;
                virtualPolygon._isInfiniteReflection = true;

                this.virtualPolygons.push(virtualPolygon);
                newLayer.polygons.push({ entity: virtualPolygon, opacity: newOpacity, isReal: false });
            });
        });
    }

    /**
     * Reflect viewers from previous layer
     * @private
     */
    _reflectViewersFromLayer({ prevLayer, newLayer, mirrors, fadeRate, depth }) {
        prevLayer.viewers.forEach(({ entity: sourceViewer, opacity: sourceOpacity, isReal }) => {
            mirrors.forEach(sourceMirror => {
                // Skip self-reflection for real objects with their own mirror
                if (isReal && this._isSelfReflection(sourceViewer, sourceMirror)) return;

                const reflectedPoint = this._reflectPoint({ x: sourceViewer.x, y: sourceViewer.y }, sourceMirror);
                const newOpacity = sourceOpacity * fadeRate;

                // Create virtual viewer
                const virtualViewer = new VirtualViewer({
                    x: reflectedPoint.x,
                    y: reflectedPoint.y,
                    radius: sourceViewer.radius,
                    fill: sourceViewer.fill,
                    stroke: sourceViewer.stroke,
                    strokeWidth: sourceViewer.strokeWidth,
                    parentSvg: this.svgCanvas,
                    sourceViewer: isReal ? sourceViewer : sourceViewer.sourceViewer,
                    sourceMirror: sourceMirror,
                    opacity: newOpacity
                });

                // Add metadata for debugging and optimization
                virtualViewer._reflectionDepth = depth;
                virtualViewer._isInfiniteReflection = true;

                this.virtualViewers.push(virtualViewer);
                newLayer.viewers.push({ entity: virtualViewer, opacity: newOpacity, isReal: false });
            });
        });
    }

    /**
     * Update infinite reflections based on current positions
     * For performance, we recreate the entire infinite reflection system
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {Object} [config.infiniteConfig] - Infinite reflection configuration
     */
    updateInfiniteReflections({ polygons, viewers = [], mirrors, infiniteConfig = {} }) {
        // Throttle updates for performance
        const now = performance.now();
        if (now - this.lastUpdateTime < 16) return; // ~60fps max
        
        this.lastUpdateTime = now;
        
        // For infinite reflections, it's more efficient to recreate than update
        // because the relationship matrix becomes complex
        this.createInfiniteReflections({ polygons, viewers, mirrors, infiniteConfig });
    }

    /**
     * Helper method to reflect vertices over a mirror
     * @private
     */
    _reflectVertices(vertices, mirror) {
        const axis = {
            x1: mirror.x1,
            y1: mirror.y1,
            x2: mirror.x2,
            y2: mirror.y2
        };
        return reflectPolygonOverAxis({ polygon: vertices, axis });
    }

    /**
     * Helper method to reflect a point over a mirror
     * @private
     */
    _reflectPoint(point, mirror) {
        const axis = {
            x1: mirror.x1,
            y1: mirror.y1,
            x2: mirror.x2,
            y2: mirror.y2
        };
        return reflectPolygonOverAxis({ polygon: [point], axis })[0];
    }

    /**
     * Check if this would be a self-reflection (object reflecting in its source mirror)
     * @private
     */
    _isSelfReflection(object, mirror) {
        // For now, simple implementation - can be enhanced with spatial checks
        // Future enhancement: check if object is touching or very close to the mirror
        return false;
    }

    /**
     * Clear all existing virtual reflections
     */
    clearReflections() {
        this.virtualPolygons.forEach(virtualPolygon => virtualPolygon.destroy());
        this.virtualViewers.forEach(virtualViewer => virtualViewer.destroy());
        this.virtualPolygons = [];
        this.virtualViewers = [];
        this.isEnabled = false;
    }

    /**
     * Get statistics about current infinite reflections
     * @returns {Object} Statistics object
     */
    getStats() {
        const depths = this.virtualPolygons.map(p => p._reflectionDepth || 0);
        return {
            enabled: this.isEnabled,
            totalVirtualPolygons: this.virtualPolygons.length,
            totalVirtualViewers: this.virtualViewers.length,
            maxDepth: Math.max(...depths, 0),
            avgDepth: depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0
        };
    }

    /**
     * Clean up all infinite reflection resources
     */
    destroy() {
        this.clearReflections();
    }
}
