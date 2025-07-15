/**
 * @file ReflectionEngine.js - Manages virtual reflections of real objects
 * Main exports: ReflectionEngine
 */

import { VirtualObjectManager } from './VirtualObjectManager.js';

/**
 * @class ReflectionEngine
 * Handles creation, updating, and management of virtual polygon and viewer reflections
 * with configurable recursive reflection depth for infinite mirror effects
 */
export class ReflectionEngine {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering virtual objects
     * @param {Function} [config.onVirtualPolygonClick] - Callback for virtual polygon clicks
     * @param {boolean} [config.virtualPolygonsClickable=true] - Whether virtual polygons should be clickable
     * @param {number} [config.recursiveReflectionDepth=3] - Number of recursive reflection layers to create
     */
    constructor({ 
        svgCanvas, 
        onVirtualPolygonClick = null, 
        virtualPolygonsClickable = true,
        recursiveReflectionDepth = 3
    }) {
        this.virtualPolygons = [];
        this.virtualViewers = [];
        this.virtualMirrors = [];
        this.recursiveReflectionDepth = recursiveReflectionDepth;

        this.svgCanvas = svgCanvas;

        // Create manager for individual virtual objects
        this.objectManager = new VirtualObjectManager({
            svgCanvas,
            onVirtualPolygonClick,
            virtualPolygonsClickable
        });
    }

    /**
     * Create reflections of all polygons, viewers, and mirrors across all mirrors
     * 
     * This is the main entry point for the recursive reflection system.
     * Uses an elegant tree-based approach with layer-by-layer processing.
     * 
     * Process Overview:
     * 1. Build reflection tree structure (createReflectionTree)
     * 2. Process reflections layer by layer (createRecursiveReflections)
     * 
     * The tree approach ensures:
     * - Each virtual mirror only reflects objects from its own level
     * - Controlled recursion depth (no infinite loops)
     * - Clear hierarchical organization of reflection relationships
     * - Efficient processing (breadth-first rather than depth-first)
     * 
     * @param {Object} config
     * @param {Array} config.polygons - Array of real polygon objects
     * @param {Array} [config.viewers] - Array of real viewer objects
     * @param {Array} config.mirrors - Array of mirror objects
     */
    createReflections({ polygons, viewers = [], mirrors }) {
        this.createReflectionTree({ polygons, viewers, mirrors });
        this.createRecursiveReflections();
    }

    /**
     * Creates the initial tree structure for managing recursive reflections
     * 
     * The tree represents reflection hierarchy where:
     * - Root node: contains original real objects (no parent mirror)
     * - Level 1 nodes: reflections created by real mirrors
     * - Level 2+ nodes: reflections created by virtual mirrors from previous levels
     * 
     * Each node contains:
     * - parentMirror: the mirror that creates reflections in this node
     * - childrenObjects: the objects that will be reflected by parentMirror
     * - childrenNodes: sub-nodes representing further reflection levels
     * 
     * @param {Object} config
     * @param {Array} config.polygons - Original real polygon objects
     * @param {Array} config.viewers - Original real viewer objects  
     * @param {Array} config.mirrors - Original real mirror objects
     */
    createReflectionTree({ polygons, viewers, mirrors }) {
        // Create root node representing the original real world
        this.reflectionTree = {
            parentMirror: null, // No parent - this is the real world
            childrenObjects: {
                mirrors: [],   // Will be populated by child nodes
                viewers: [],   // Will be populated by child nodes
                polygons: []   // Will be populated by child nodes
            },
            childrenNodes: [] // Will contain one node per real mirror
        };

        // Create first-level nodes - one for each real mirror
        // Each node represents "what this mirror will reflect"
        for (const mirror of mirrors) {
            const newNode = {
                parentMirror: mirror,           // This mirror creates the reflections
                childrenObjects: {
                    mirrors: mirrors,           // All real mirrors get reflected
                    viewers: viewers,           // All real viewers get reflected
                    polygons: polygons          // All real polygons get reflected
                },
                childrenNodes: []               // Will be populated with virtual mirror nodes
            };
            this.reflectionTree.childrenNodes.push(newNode);
        }
    }

    /**
     * Creates reflections of objects across a specific mirror and updates the reflection tree
     * 
     * This method:
     * 1. Takes objects from the reflectionNode and reflects them across the given mirror
     * 2. Creates virtual polygons, viewers, and mirrors as reflections
     * 3. For each virtual mirror created, adds a new child node to the tree
     * 4. Each child node contains the virtual objects that the virtual mirror can reflect
     * 
     * The tree growth pattern:
     * - Input node contains objects to reflect
     * - Output: virtual objects are created and stored globally
     * - Side effect: new child nodes added representing next reflection level
     * 
     * @param {Object} config
     * @param {Mirror} config.mirror - The mirror performing the reflection
     * @param {Object} config.reflectionNode - Tree node containing objects to reflect
     * @param {Object} config.reflectionNode.childrenObjects - Objects available for reflection
     * @param {Array} config.reflectionNode.childrenObjects.polygons - Polygons to reflect
     * @param {Array} config.reflectionNode.childrenObjects.viewers - Viewers to reflect
     * @param {Array} config.reflectionNode.childrenObjects.mirrors - Mirrors to reflect
     */
    createReflectionsOverMirror({ mirror, reflectionNode }) {
        // Extract objects to reflect from the current tree node
        const currentPolygons = reflectionNode.childrenObjects.polygons;
        const currentViewers = reflectionNode.childrenObjects.viewers;
        const currentMirrors = reflectionNode.childrenObjects.mirrors;

        // Collections for newly created virtual objects at this level
        const virtualPolygons = [];
        const virtualViewers = [];
        const virtualMirrors = [];

        // Create virtual polygons for each polygon-mirror combination
        currentPolygons.forEach(polygon => {
            const virtualPolygon = this.objectManager.createVirtualPolygon({ polygon, mirror });
            this.virtualPolygons.push(virtualPolygon);    // Store globally
            virtualPolygons.push(virtualPolygon);         // Store locally for tree node
        });

        // Create virtual viewers for each viewer-mirror combination
        currentViewers.forEach(viewer => {
            const virtualViewer = this.objectManager.createVirtualViewer({ viewer, mirror });
            this.virtualViewers.push(virtualViewer);      // Store globally
            virtualViewers.push(virtualViewer);           // Store locally for tree node
        });

        // Create virtual mirrors for each mirror-mirror combination
        currentMirrors.forEach(mirrorToReflect => {
            if (mirrorToReflect === mirror) return; // Skip self-reflection
            
            const virtualMirror = this.objectManager.createVirtualMirror({ 
                mirror: mirrorToReflect, 
                reflectionMirror: mirror 
            });
            this.virtualMirrors.push(virtualMirror);      // Store globally
            virtualMirrors.push(virtualMirror);           // Store locally for tree node
        });

        // For each virtual mirror created, add a child node to the tree
        // Each child node represents "what this virtual mirror can reflect in the next level" (which are the objects of this level)
        virtualMirrors.forEach(virtualMirror => {
            const newNode = {
                parentMirror: virtualMirror,              // This virtual mirror creates next level
                childrenObjects: {
                    mirrors: virtualMirrors,              // Virtual mirrors from this level
                    viewers: virtualViewers,              // Virtual viewers from this level  
                    polygons: virtualPolygons             // Virtual polygons from this level
                },
                childrenNodes: []                         // Will be populated in next iteration
            };
            reflectionNode.childrenNodes.push(newNode);
        });
    }

    /**
     * Orchestrates recursive reflection creation using layer-by-layer processing
     * Process reflections level by level (breadth-first) rather than depth-first
     */
    createRecursiveReflections() {
        /**
         * Extracts all nodes at a specific layer depth from the reflection tree
         * @param {Object} config
         * @param {Object} config.tree - The reflection tree to traverse
         * @param {number} config.layer - Target layer depth (0-based)
         * @returns {Array} All nodes found at the specified layer
         */
        function getLayerNodes({ tree, layer }) {
            const layerNodes = [];

            /**
             * Recursive tree traversal to find nodes at target depth
             * @param {Object} node - Current node being examined
             * @param {number} currentLayer - Current depth in traversal
             */
            function traverse(node, currentLayer) {
                if (currentLayer === layer) {
                    layerNodes.push(node);
                    return; // Found target layer, don't go deeper
                }
                // Continue traversing children at next depth level
                node.childrenNodes.forEach(child => traverse(child, currentLayer + 1));
            }
            
            traverse(tree, 0); // Start traversal from root at layer 0
            return layerNodes;
        }

        // Process configured number of reflection levels
        // Layer 0 is the root and doesn't create reflections
        for (let i = 0; i < this.recursiveReflectionDepth; i++) {
            const layerNodes = getLayerNodes({ tree: this.reflectionTree, layer: i + 1 });
            
            // For each node at this layer, create reflections using its parent mirror
            for (const node of layerNodes) {
                this.createReflectionsOverMirror({
                    mirror: node.parentMirror,    // Mirror that creates reflections
                    reflectionNode: node          // Node containing objects to reflect
                });
            }
        }
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
