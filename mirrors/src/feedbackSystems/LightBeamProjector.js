/**
 * @file LightBeamProjector.js - Handles casting light beams from polygon interactions
 * Main exports: LightBeamProjector
 * 
 * TERMINOLOGY:
 * - Virtual Projection: Light beam projected from a virtual polygon directly to the viewer
 * - Real Projection: Light beam projected from the real polygon through mirror reflections to the viewer
 * - Projections are the specific light beams that connect polygons to the viewer when clicked
 */

import { VirtualLightBeam } from '../basicEntities/virtual/VirtualLightBeam.js';
import { calculatePolygonCenter } from '../math/analyticalGeometry.js';
import { normalizeVector, vectorLength } from '../math/linearAlgebra.js';

/**
 * @class LightBeamProjector
 * Projects light beams from virtual polygons to the viewer when clicked
 */
export class LightBeamProjector {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG canvas for rendering beams
     * @param {Object} config.viewer - The single viewer object
     * @param {Object} config.lightBeamEngine - Light beam engine for creating real light beams
     * @param {Array} config.mirrors - Array of mirror objects for beam reflections
     * @param {Object} config.beamConfig - Beam appearance and behavior configuration
     */
    constructor({ svgCanvas, viewer, lightBeamEngine, mirrors, beamConfig }) {
        this.svgCanvas = svgCanvas;
        this.viewer = viewer;
        this.lightBeamEngine = lightBeamEngine;
        this.mirrors = mirrors;
        this.beamConfig = this.initializeBeamConfig(beamConfig);
        this.virtualProjections = [];
        this.realProjections = [];
        this.lastClickedVirtualPolygon = null;
    }

    /**
     * Initialize beam configuration with defaults
     * @param {Object|undefined} beamConfig - User-provided beam configuration
     * @returns {Object} Complete beam configuration with defaults
     */
    initializeBeamConfig(beamConfig) {
        return {
            virtualBeam: {
                color: beamConfig?.virtualBeam?.color || '#fa6c00',
                strokeWidth: beamConfig?.virtualBeam?.strokeWidth || 2,
                animationDuration: beamConfig?.virtualBeam?.animationDuration || 1000,
                tolerance: beamConfig?.virtualBeam?.tolerance || 10
            },
            realBeam: {
                color: beamConfig?.realBeam?.color || '#ffdd00',
                strokeWidth: beamConfig?.realBeam?.strokeWidth || 2,
                animationDuration: beamConfig?.realBeam?.animationDuration || 1000
            }
        };
    }

    // ============================================
    // PUBLIC INTERFACE
    // ============================================

    /**
     * Cast both real and virtual projections from virtual polygon to the viewer
     * Only casts projections if the reflection is valid (endpoint matches viewer)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    castRealAndVirtualProjections({ virtualPolygon }) {
        if (!this.viewer) return;

        this.lastClickedVirtualPolygon = virtualPolygon;
        this.clearAllBeams();
        
        // Only cast beams if reflection is valid
        if (this.isProjectionEndpointAtViewer({ virtualPolygon })) {
            this.castVirtualProjection({ virtualPolygon });
            this.castRealProjection({ virtualPolygon });
        }
    }

    /**
     * Update both virtual and real beams when scene elements are dragged
     * Only updates beams if the reflection is still valid, clears them otherwise
     */
    updateBeams() {
        if (!this.lastClickedVirtualPolygon || !this.viewer) return;

        // Check if reflection is still valid after dragging
        if (this.isProjectionEndpointAtViewer({ virtualPolygon: this.lastClickedVirtualPolygon })) {
            this.updateVirtualProjection();
            this.updateRealProjection();
        } else {
            // Clear beams if reflection is no longer valid
            this.clearAllBeams();
        }
    }

    /**
     * Clear all beams (both virtual and real)
     */
    clearAllBeams() {
        this.clearVirtualProjections();
        this.clearRealBeams();
    }

    // ============================================
    // VIRTUAL BEAM METHODS
    // ============================================

    /**
     * Cast a virtual projection from virtual polygon to viewer
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     */
    castVirtualProjection({ virtualPolygon }) {
        this.clearVirtualProjections();

        // Calculate emission point (center of virtual polygon)
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        
        // Calculate direction vector from polygon to viewer
        const polygonToViewerDirection = { 
            x: this.viewer.x - virtualPolygonCenter.x, 
            y: this.viewer.y - virtualPolygonCenter.y 
        };
        const normalizedDirectionToViewer = normalizeVector({ vector: polygonToViewerDirection });
        
        // Calculate projection length
        const projectionLength = vectorLength({ vector: polygonToViewerDirection });
        
        // Create virtual projection configuration
        const virtualProjectionConfig = {
            emissionPoint: virtualPolygonCenter,
            directorVector: normalizedDirectionToViewer,
            maxLength: projectionLength,
            strokeColor: this.beamConfig.virtualBeam.color,
            strokeWidth: this.beamConfig.virtualBeam.strokeWidth,
            animated: true,
            animationDuration: this.beamConfig.virtualBeam.animationDuration,
            parentSvg: this.svgCanvas
        };
        
        const virtualProjection = new VirtualLightBeam(virtualProjectionConfig);
        this.virtualProjections.push(virtualProjection);
    }

    /**
     * Update the virtual projection when scene elements are dragged
     */
    updateVirtualProjection() {
        if (this.virtualProjections.length === 0) return;

        // Calculate emission point (center of virtual polygon)
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: this.lastClickedVirtualPolygon.vertices });
        
        // Calculate direction vector from polygon to viewer
        const polygonToViewerDirection = { 
            x: this.viewer.x - virtualPolygonCenter.x, 
            y: this.viewer.y - virtualPolygonCenter.y 
        };
        const normalizedDirectionToViewer = normalizeVector({ vector: polygonToViewerDirection });
        
        // Calculate projection length
        const projectionLength = vectorLength({ vector: polygonToViewerDirection });

        const virtualProjection = this.virtualProjections[0];
        virtualProjection.emissionPoint = virtualPolygonCenter;
        virtualProjection.directorVector = normalizedDirectionToViewer;
        virtualProjection.maxLength = projectionLength;
        virtualProjection.points = [
            virtualPolygonCenter,
            {
                x: virtualPolygonCenter.x + normalizedDirectionToViewer.x * projectionLength,
                y: virtualPolygonCenter.y + normalizedDirectionToViewer.y * projectionLength
            }
        ];

        virtualProjection.updateBeamPath();
    }

    /**
     * Clear all virtual projections
     */
    clearVirtualProjections() {
        this.virtualProjections.forEach(virtualProjection => {
            virtualProjection.destroy();
        });
        this.virtualProjections = [];
    }

    // ============================================
    // REAL BEAM METHODS
    // ============================================

    /**
     * Cast a real projection from source polygon using calculated reflection path
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     */
    castRealProjection({ virtualPolygon }) {
        if (!this.lightBeamEngine) return;

        this.clearRealBeams();

        const realProjectionDirectorVector = this.getRealProjectionDirectorVector({ virtualPolygon });
        if (!realProjectionDirectorVector) return;

        // Calculate real projection properties inline
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        const virtualPolygonToViewerDirection = { 
            x: virtualPolygonCenter.x - this.viewer.x, 
            y: virtualPolygonCenter.y - this.viewer.y 
        };
        const realProjectionLength = vectorLength({ vector: virtualPolygonToViewerDirection });
        const realPolygonCenter = calculatePolygonCenter({ 
            vertices: virtualPolygon.sourcePolygon.vertices 
        });

        const realProjection = this.lightBeamEngine.createLightBeam({
            emissionPoint: realPolygonCenter,
            directorVector: realProjectionDirectorVector,
            maxLength: realProjectionLength,
            strokeColor: this.beamConfig.realBeam.color,
            strokeWidth: this.beamConfig.realBeam.strokeWidth,
            animated: true,
            animationDuration: this.beamConfig.realBeam.animationDuration,
            mirrors: this.mirrors
        });
        this.realProjections.push(realProjection);
    }

    /**
     * Update the real projection when scene elements are dragged
     */
    updateRealProjection() {
        if (this.realProjections.length === 0) return;

        const realProjectionDirectorVector = this.getRealProjectionDirectorVector({ 
            virtualPolygon: this.lastClickedVirtualPolygon 
        });
        if (!realProjectionDirectorVector) return;

        // Calculate real projection properties inline
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: this.lastClickedVirtualPolygon.vertices });
        const polygonToViewerDirection = { 
            x: virtualPolygonCenter.x - this.viewer.x, 
            y: virtualPolygonCenter.y - this.viewer.y 
        };
        const realProjectionLength = vectorLength({ vector: polygonToViewerDirection });
        const realPolygonCenter = calculatePolygonCenter({ 
            vertices: this.lastClickedVirtualPolygon.sourcePolygon.vertices 
        });

        // Create temporary beam to get updated reflection points
        const tempProjection = this.lightBeamEngine.createLightBeam({
            emissionPoint: realPolygonCenter,
            directorVector: realProjectionDirectorVector,
            maxLength: realProjectionLength,
            strokeColor: this.beamConfig.realBeam.color,
            strokeWidth: this.beamConfig.realBeam.strokeWidth,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });

        // Update existing projection with new properties
        if (tempProjection && tempProjection.points && this.realProjections[0]) {
            const realProjection = this.realProjections[0];
            realProjection.emissionPoint = realPolygonCenter;
            realProjection.directorVector = realProjectionDirectorVector;
            realProjection.maxLength = realProjectionLength;
            realProjection.points = [...tempProjection.points];
            realProjection.updateBeamPath();
        }

        // Cleanup
        if (tempProjection && tempProjection.destroy) {
            tempProjection.destroy();
        }
    }

    /**
     * Clear all real beams
     */
    clearRealBeams() {
        this.realProjections.forEach(beam => {
            if (beam && beam.destroy) {
                beam.destroy();
            }
        });
        this.realProjections = [];
    }

    // ============================================
    // CALCULATION HELPERS
    // ============================================

    /**
     * Calculate the director vector for real projection using reflection path analysis
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon to analyze
     * @returns {Object|null} Normalized direction vector {x, y} or null if calculation fails
     */
    getRealProjectionDirectorVector({ virtualPolygon }) {
        if (!this.viewer || !this.lightBeamEngine) return null;
        
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        const polygonToViewerDirection = { 
            x: virtualPolygonCenter.x - this.viewer.x, 
            y: virtualPolygonCenter.y - this.viewer.y 
        };
        const normalizedDirectionToViewer = normalizeVector({ vector: polygonToViewerDirection });
        const projectionLength = vectorLength({ vector: polygonToViewerDirection });
        
        // Create temporary projection to calculate reflection path
        const tempProjection = this.lightBeamEngine.createLightBeam({
            emissionPoint: { x: this.viewer.x, y: this.viewer.y },
            directorVector: normalizedDirectionToViewer,
            maxLength: projectionLength,
            strokeColor: this.beamConfig.realBeam.color,
            strokeWidth: this.beamConfig.realBeam.strokeWidth,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });
        
        let realProjectionDirectorVector = null;
        
        // Extract direction from last segment
        if (tempProjection && tempProjection.points && tempProjection.points.length >= 2) {
            const reflectionPoints = tempProjection.points;
            const lastReflectionPoint = reflectionPoints[reflectionPoints.length - 1];
            const secondLastReflectionPoint = reflectionPoints[reflectionPoints.length - 2];
            
            const segmentDirection = {
                x: lastReflectionPoint.x - secondLastReflectionPoint.x,
                y: lastReflectionPoint.y - secondLastReflectionPoint.y
            };
            
            // Invert direction (we want real polygon → viewer, not viewer → virtual polygon)
            const invertedDirection = {
                x: -segmentDirection.x,
                y: -segmentDirection.y
            };
            realProjectionDirectorVector = normalizeVector({ vector: invertedDirection });
        }
        
        // Cleanup
        if (tempProjection && tempProjection.destroy) {
            tempProjection.destroy();
        }
        
        return realProjectionDirectorVector;
    }

    // ============================================
    // VALIDATION HELPERS
    // ============================================

    /**
     * Check if the real projection endpoint is close enough to the viewer center
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if projection endpoint matches viewer position
     */
    isProjectionEndpointAtViewer({ virtualPolygon }) {
        const realProjectionDirectorVector = this.getRealProjectionDirectorVector({ virtualPolygon });
        if (!realProjectionDirectorVector) return false;

        // Calculate real projection properties inline
        const virtualPolygonCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        const polygonToViewerDirection = { 
            x: virtualPolygonCenter.x - this.viewer.x, 
            y: virtualPolygonCenter.y - this.viewer.y 
        };
        const realProjectionLength = vectorLength({ vector: polygonToViewerDirection });
        const realPolygonCenter = calculatePolygonCenter({ 
            vertices: virtualPolygon.sourcePolygon.vertices 
        });
        
        // Create temporary projection to get reflection path
        const tempProjection = this.lightBeamEngine.createLightBeam({
            emissionPoint: realPolygonCenter,
            directorVector: realProjectionDirectorVector,
            maxLength: realProjectionLength,
            strokeColor: this.beamConfig.realBeam.color,
            strokeWidth: this.beamConfig.realBeam.strokeWidth,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });

        let isValidProjection = false;
        if (tempProjection && tempProjection.points && tempProjection.points.length > 0) {
            const projectionEndpoint = tempProjection.points[tempProjection.points.length - 1];
            const distanceToViewer = Math.sqrt(
                Math.pow(projectionEndpoint.x - this.viewer.x, 2) + 
                Math.pow(projectionEndpoint.y - this.viewer.y, 2)
            );
            isValidProjection = distanceToViewer < this.beamConfig.virtualBeam.tolerance;
        }

        // Cleanup
        if (tempProjection && tempProjection.destroy) {
            tempProjection.destroy();
        }

        return isValidProjection;
    }
}
