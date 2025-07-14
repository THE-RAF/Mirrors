/**
 * @file config/scenes/triangularBox.js - Triangular mirror box scene
 * Three-mirror triangular arrangement for kaleidoscope patterns
 */

import { createStar, createHeart, createDiamond } from '../../utils/geometryFactory.js';

export const triangularBox = {
    mode: 'simpleReflections',
    objects: [
        {
            // Star shape - positioned in center
            vertices: createStar({ 
                center: { x: 480, y: 322 }, 
                outerRadius: 25, 
                innerRadius: 10, 
                points: 5 
            }),
            fill: '#ff6b6b'
        },
        {
            // Heart shape - positioned off-center
            vertices: createHeart({ 
                center: { x: 320, y: 320 }, 
                size: 18 
            }),
            fill: '#ffcc00'
        },
        {
            // Diamond shape - positioned near edge
            vertices: createDiamond({ 
                center: { x: 400, y: 460 }, 
                size: 20 
            }),
            fill: '#00ccff'
        }
    ],
    mirrors: [
        {
            // Top mirror (horizontal-ish, angled)
            x1: 250, y1: 280,
            x2: 550, y2: 280
        },
        {
            // Bottom left mirror (angled down-right)
            x1: 400, y1: 550,
            x2: 250, y2: 280
        },
        {
            // Bottom right mirror (angled down-left)
            x1: 550, y1: 280,
            x2: 400, y2: 550
        }
    ],
    viewers: [
        {
            // Viewer positioned inside the triangular space
            x: 400,
            y: 370,
            radius: 8,
            fill: '#4a90e2'
        }
    ],
    lightBeams: []
};
