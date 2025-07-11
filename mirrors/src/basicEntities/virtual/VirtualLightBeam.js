/**
 * @file VirtualLightBeam.js - Virtual light beam with distinctive visual styling
 * Main exports: VirtualLightBeam
 */

import { LightBeam } from '../real/LightBeam.js';

/**
 * @class VirtualLightBeam
 * Virtual light beam that represents virtual light paths with distinctive visual styling
 */
export class VirtualLightBeam extends LightBeam {
    /**
     * @param {Object} config
     * @param {Object} config.emissionPoint - Starting point {x, y}
     * @param {Object} config.directorVector - Direction vector {x, y} (normalized)
     * @param {number} [config.maxLength=800] - Maximum length of the beam
     * @param {string} [config.strokeColor='#ffdd00'] - Color of the beam
     * @param {number} [config.strokeWidth=2] - Width of the beam stroke
     * @param {boolean} [config.animated=true] - Whether to animate beam creation
     * @param {number} [config.animationDuration=1000] - Animation duration in ms
     * @param {SVGElement} config.parentSvg - Parent SVG container
     */
    constructor({
        emissionPoint,
        directorVector,
        maxLength = 800,
        strokeColor = '#ffdd00',
        strokeWidth = 2,
        animated = true,
        animationDuration = 1000,
        parentSvg
    }) {
        super({
            emissionPoint,
            directorVector,
            maxLength,
            strokeColor,
            strokeWidth,
            animated,
            animationDuration,
            parentSvg
        });
        
        this.applyVirtualStyling();
    }
    
    /**
     * Apply virtual-specific styling to the SVG element
     */
    applyVirtualStyling() {
        if (!this.element) return;
        
        // Add dashed stroke
        this.element.setAttribute('stroke-dasharray', '8,4');
        
        // Reduce opacity for virtual appearance
        this.element.setAttribute('opacity', '0.6');
    }
}
