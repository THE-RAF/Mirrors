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

        // Store the virtual polygon for updates
        this.lastClickedVirtualPolygon = virtualPolygon;

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
     * Update virtual beams when scene elements are dragged
     */
    updateBeams() {
        // Only update if we have virtual beams, a last clicked virtual polygon and a viewer
        if (this.virtualBeams.length === 0 || !this.lastClickedVirtualPolygon || !this.viewer) return;

        // Calculate new polygon center
        const center = calculatePolygonCenter({ vertices: this.lastClickedVirtualPolygon.vertices });
        
        // Calculate new direction and distance to viewer
        const direction = { x: this.viewer.x - center.x, y: this.viewer.y - center.y };
        const normalizedDirection = normalizeVector({ vector: direction });
        const distance = vectorLength({ vector: direction });
        
        // Update the existing beam's properties and path
        const beam = this.virtualBeams[0];
        beam.emissionPoint = center;
        beam.directorVector = normalizedDirection;
        beam.maxLength = distance;
        beam.points = [
            center,
            {
                x: center.x + normalizedDirection.x * distance,
                y: center.y + normalizedDirection.y * distance
            }
        ];
        
        // Update the beam's visual path
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
}
