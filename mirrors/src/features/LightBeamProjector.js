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
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG canvas for rendering beams
     * @param {Object} config.viewer - The single viewer object
     */
    constructor({ svgCanvas, viewer }) {
        this.svgCanvas = svgCanvas;
        this.viewer = viewer;
        this.virtualBeams = [];
    }

    /**
     * Cast virtual light beam from virtual polygon center to the viewer
     * @param {Object} config
     * @param {VirtualPolygon} config.virtualPolygon - The clicked virtual polygon
     */
    castVirtualBeamToViewer({ virtualPolygon }) {
        if (!this.viewer) return;

        // Clear existing beams
        this.clearVirtualBeams();
        
        // Calculate polygon center
        const center = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
        
        // Direction vector to viewer
        const direction = { x: this.viewer.x - center.x, y: this.viewer.y - center.y };
        const normalizedDirection = normalizeVector({ vector: direction });
        const distance = vectorLength({ vector: direction });
        
        // Create beam
        const virtualBeam = new VirtualLightBeam({
            emissionPoint: center,
            directorVector: normalizedDirection,
            maxLength: distance,
            strokeColor: '#ff4444',
            strokeWidth: 2,
            animated: true,
            animationDuration: 600,
            parentSvg: this.svgCanvas
        });

        this.virtualBeams.push(virtualBeam);
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
}
