/**
 * @file LightBeamProjector.js - Handles casting light beams from polygon interactions
 * Main exports: LightBeamProjector
 */

import { VirtualLightBeam } from '../basicEntities/virtual/VirtualLightBeam.js';
import { calculatePolygonCenter } from '../math/analyticalGeometry.js';
import { normalizeVector, vectorLength } from '../math/linearAlgebra.js';

/**
 * @class LightBeamProjector
 * Projects light beams from virtual polygons to the viewer when clicked
 */
export class LightBeamProjector {
    // Constants
    static VIRTUAL_BEAM_COLOR = '#ff4444';
    static REAL_BEAM_COLOR = '#ffdd00';
    static BEAM_STROKE_WIDTH = 2;
    static VIRTUAL_ANIMATION_DURATION = 800;
    static REAL_ANIMATION_DURATION = 800;

    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG canvas for rendering beams
     * @param {Object} config.viewer - The single viewer object
     * @param {Object} config.lightBeamEngine - Light beam engine for creating real light beams
     * @param {Array} config.mirrors - Array of mirror objects for beam reflections
     */
    constructor({ svgCanvas, viewer, lightBeamEngine, mirrors }) {
        this.svgCanvas = svgCanvas;
        this.viewer = viewer;
        this.lightBeamEngine = lightBeamEngine;
        this.mirrors = mirrors;
        this.virtualBeams = [];
        this.realBeams = [];
        this.lastClickedVirtualPolygon = null;
    }

    // ============================================
    // PUBLIC INTERFACE
    // ============================================

    /**
     * Cast virtual light beam from virtual polygon center to the viewer
     * Only casts beams if the reflection is valid (endpoint matches viewer)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    castVirtualBeamToViewer({ virtualPolygon }) {
        if (!this.viewer) return;

        this.lastClickedVirtualPolygon = virtualPolygon;
        this.clearAllBeams();
        
        // Only cast beams if reflection is valid
        if (this.isBeamEndpointAtViewer({ virtualPolygon })) {
            this.castVirtualBeam({ virtualPolygon });
            this.castRealBeam({ virtualPolygon });
        }
    }

    /**
     * Update both virtual and real beams when scene elements are dragged
     * Only updates beams if the reflection is still valid, clears them otherwise
     */
    updateBeams() {
        if (!this.lastClickedVirtualPolygon || !this.viewer) return;

        // Check if reflection is still valid after dragging
        if (this.isBeamEndpointAtViewer({ virtualPolygon: this.lastClickedVirtualPolygon })) {
            this.updateVirtualBeam();
            this.updateRealBeam();
        } else {
            // Clear beams if reflection is no longer valid
            this.clearAllBeams();
        }
    }

    /**
     * Clear all beams (both virtual and real)
     */
    clearAllBeams() {
        this.clearVirtualBeams();
        this.clearRealBeams();
    }

    // ============================================
    // VIRTUAL BEAM METHODS
    // ============================================

    /**
     * Cast a virtual beam from virtual polygon to viewer
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     */
    castVirtualBeam({ virtualPolygon }) {
        this.clearVirtualBeams();

        const { center, directionToViewer, distance } = this.calculateVirtualBeamProperties({ virtualPolygon });
        const config = this.getVirtualBeamConfig({ center, directionToViewer, distance });
        
        const virtualBeam = new VirtualLightBeam(config);
        this.virtualBeams.push(virtualBeam);
    }

    /**
     * Update the virtual beam when scene elements are dragged
     */
    updateVirtualBeam() {
        if (this.virtualBeams.length === 0) return;

        const { center, directionToViewer, distance } = this.calculateVirtualBeamProperties({ 
            virtualPolygon: this.lastClickedVirtualPolygon 
        });

        const beam = this.virtualBeams[0];
        beam.emissionPoint = center;
        beam.directorVector = directionToViewer;
        beam.maxLength = distance;
        beam.points = [
            center,
            {
                x: center.x + directionToViewer.x * distance,
                y: center.y + directionToViewer.y * distance
            }
        ];

        beam.updateBeamPath();
    }

    /**
     * Clear all virtual beams
     */
    clearVirtualBeams() {
        this.virtualBeams.forEach(beam => {
            if (beam.element?.parentNode) {
                beam.element.parentNode.removeChild(beam.element);
            }
        });
        this.virtualBeams = [];
    }

    // ============================================
    // REAL BEAM METHODS
    // ============================================

    /**
     * Cast a real beam from source polygon using calculated reflection path
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     */
    castRealBeam({ virtualPolygon }) {
        if (!this.lightBeamEngine) return;

        this.clearRealBeams();

        const directorVector = this.getPolygonBeamDirectorVector({ virtualPolygon });
        if (!directorVector) return;

        const { beamLength, realPolygonCenter } = this.calculateRealBeamProperties({ virtualPolygon });
        const config = this.getRealBeamConfig({ realPolygonCenter, directorVector, beamLength });

        const realBeam = this.lightBeamEngine.createLightBeam(config);
        this.realBeams.push(realBeam);
    }

    /**
     * Update the real beam when scene elements are dragged
     */
    updateRealBeam() {
        if (this.realBeams.length === 0) return;

        const directorVector = this.getPolygonBeamDirectorVector({ 
            virtualPolygon: this.lastClickedVirtualPolygon 
        });
        if (!directorVector) return;

        const { beamLength, realPolygonCenter } = this.calculateRealBeamProperties({ 
            virtualPolygon: this.lastClickedVirtualPolygon 
        });

        // Create temporary beam to get updated reflection points
        const tempBeam = this.lightBeamEngine.createLightBeam({
            emissionPoint: realPolygonCenter,
            directorVector: directorVector,
            maxLength: beamLength,
            strokeColor: LightBeamProjector.REAL_BEAM_COLOR,
            strokeWidth: LightBeamProjector.BEAM_STROKE_WIDTH,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });

        // Update existing beam with new properties
        if (tempBeam && tempBeam.points && this.realBeams[0]) {
            const realBeam = this.realBeams[0];
            realBeam.emissionPoint = realPolygonCenter;
            realBeam.directorVector = directorVector;
            realBeam.maxLength = beamLength;
            realBeam.points = [...tempBeam.points];
            realBeam.updateBeamPath();
        }

        // Cleanup
        if (tempBeam && tempBeam.destroy) {
            tempBeam.destroy();
        }
    }

    /**
     * Clear all real beams
     */
    clearRealBeams() {
        this.realBeams.forEach(beam => {
            if (beam && beam.destroy) {
                beam.destroy();
            }
        });
        this.realBeams = [];
    }

    // ============================================
    // CALCULATION HELPERS
    // ============================================

    /**
     * Calculate properties for virtual beam (virtual polygon to viewer)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     * @returns {Object} { center, directionToViewer, distance }
     */
    calculateVirtualBeamProperties({ virtualPolygon }) {
        const center = calculatePolygonCenter({ vertices: virtualPolygon.vertices }); // RENAME THIS TO POLYGON CENTER
        const direction = { x: this.viewer.x - center.x, y: this.viewer.y - center.y };
        const directionToViewer = normalizeVector({ vector: direction });
        const distance = vectorLength({ vector: direction }); // RENAME THIS TO BEAM LENGTH

        return { center, directionToViewer, distance };
    }

    /**
     * Calculate properties for real beam (real polygon to viewer through reflections)
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     * @returns {Object} { beamLength, realPolygonCenter }
     */
    calculateRealBeamProperties({ virtualPolygon }) {
        // Calculate beam length (distance from virtual polygon to viewer)
        const virtualCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices }); // RENAME THIS TO VIRTUAL POLYGON CENTER
        const direction = { x: virtualCenter.x - this.viewer.x, y: virtualCenter.y - this.viewer.y };
        const beamLength = vectorLength({ vector: direction });

        // Get real polygon center
        const realPolygonCenter = calculatePolygonCenter({ 
            vertices: virtualPolygon.sourcePolygon.vertices 
        });

        return { beamLength, realPolygonCenter };
    }

    /**
     * Calculate the director vector from real polygon to viewer using reflection path analysis
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon to analyze
     * @returns {Object|null} Normalized direction vector {x, y} or null if calculation fails
     */
    getPolygonBeamDirectorVector({ virtualPolygon }) {
        if (!this.viewer || !this.lightBeamEngine) return null;
        
        const virtualCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        const direction = { x: virtualCenter.x - this.viewer.x, y: virtualCenter.y - this.viewer.y };
        const normalizedDirection = normalizeVector({ vector: direction });
        const beamLength = vectorLength({ vector: direction });
        
        // Create temporary beam to calculate reflection path
        const tempBeam = this.lightBeamEngine.createLightBeam({
            emissionPoint: { x: this.viewer.x, y: this.viewer.y },
            directorVector: normalizedDirection,
            maxLength: beamLength,
            strokeColor: LightBeamProjector.REAL_BEAM_COLOR,
            strokeWidth: LightBeamProjector.BEAM_STROKE_WIDTH,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });
        
        let finalDirection = null;
        
        // Extract direction from last segment
        if (tempBeam && tempBeam.points && tempBeam.points.length >= 2) {
            const points = tempBeam.points;
            const lastPoint = points[points.length - 1];
            const secondLastPoint = points[points.length - 2];
            
            const segmentDirection = {
                x: lastPoint.x - secondLastPoint.x,
                y: lastPoint.y - secondLastPoint.y
            };
            
            // Invert direction (we want real polygon → viewer, not viewer → virtual polygon)
            const invertedDirection = {
                x: -segmentDirection.x,
                y: -segmentDirection.y
            };
            finalDirection = normalizeVector({ vector: invertedDirection });
        }
        
        // Cleanup
        if (tempBeam && tempBeam.destroy) {
            tempBeam.destroy();
        }
        
        return finalDirection;
    }

    // ============================================
    // CONFIGURATION HELPERS
    // ============================================

    /**
     * Get configuration object for virtual beam creation
     * @param {Object} config
     * @param {Object} config.center - Emission point
     * @param {Object} config.directionToViewer - Normalized direction vector
     * @param {number} config.distance - Beam length
     * @returns {Object} Virtual beam configuration
     */
    getVirtualBeamConfig({ center, directionToViewer, distance }) {
        return {
            emissionPoint: center,
            directorVector: directionToViewer,
            maxLength: distance,
            strokeColor: LightBeamProjector.VIRTUAL_BEAM_COLOR,
            strokeWidth: LightBeamProjector.BEAM_STROKE_WIDTH,
            animated: true,
            animationDuration: LightBeamProjector.VIRTUAL_ANIMATION_DURATION,
            parentSvg: this.svgCanvas
        };
    }

    /**
     * Get configuration object for real beam creation
     * @param {Object} config
     * @param {Object} config.realPolygonCenter - Emission point
     * @param {Object} config.directorVector - Normalized direction vector
     * @param {number} config.beamLength - Beam length
     * @returns {Object} Real beam configuration
     */
    getRealBeamConfig({ realPolygonCenter, directorVector, beamLength }) {
        return {
            emissionPoint: realPolygonCenter,
            directorVector: directorVector,
            maxLength: beamLength,
            strokeColor: LightBeamProjector.REAL_BEAM_COLOR,
            strokeWidth: LightBeamProjector.BEAM_STROKE_WIDTH,
            animated: true,
            animationDuration: LightBeamProjector.REAL_ANIMATION_DURATION,
            mirrors: this.mirrors
        };
    }

    // ============================================
    // VALIDATION HELPERS
    // ============================================

    /**
     * Check if the real beam endpoint is close enough to the viewer center
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The virtual polygon
     * @returns {boolean} True if beam endpoint matches viewer position
     */
    isBeamEndpointAtViewer({ virtualPolygon }) {
        const directorVector = this.getPolygonBeamDirectorVector({ virtualPolygon });
        if (!directorVector) return false;

        const { beamLength, realPolygonCenter } = this.calculateRealBeamProperties({ virtualPolygon });
        
        // Create temporary beam to get reflection path
        const tempBeam = this.lightBeamEngine.createLightBeam({
            emissionPoint: realPolygonCenter,
            directorVector: directorVector,
            maxLength: beamLength,
            strokeColor: LightBeamProjector.REAL_BEAM_COLOR,
            strokeWidth: LightBeamProjector.BEAM_STROKE_WIDTH,
            animated: false,
            animationDuration: 0,
            mirrors: this.mirrors
        });

        let isValid = false;
        if (tempBeam && tempBeam.points && tempBeam.points.length > 0) {
            const endpoint = tempBeam.points[tempBeam.points.length - 1];
            const distance = Math.sqrt(
                Math.pow(endpoint.x - this.viewer.x, 2) + 
                Math.pow(endpoint.y - this.viewer.y, 2)
            );
            isValid = distance < 10; // Allow 10px tolerance
        }

        // Cleanup
        if (tempBeam && tempBeam.destroy) {
            tempBeam.destroy();
        }

        return isValid;
    }
}
