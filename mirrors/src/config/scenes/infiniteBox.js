/**
 * @file config/scenes/infiniteBox.js - Infinite mirror box scene
 * Four-mirror enclosed box setup needed for infinite reflection modes
 */

import { createStar, createHeart } from '../../utils/geometryFactory.js';

export const infiniteBox = {
    mode: 'infiniteReflections',
    objects: [
        {
            // Star shape - positioned off-center for interesting reflections
            vertices: createStar({ 
                center: { x: 350, y: 350 }, 
                outerRadius: 30, 
                innerRadius: 12, 
                points: 5 
            }),
            fill: '#ff6b6b'
        },
        {
            // Heart shape - positioned in another quadrant
            vertices: createHeart({ 
                center: { x: 450, y: 450 }, 
                size: 20 
            }),
            fill: '#ffcc00'
        }
    ],
    mirrors: [
        {
            // Top mirror (horizontal)
            x1: 300, y1: 300,
            x2: 500, y2: 300
        },
        {
            // Right mirror (vertical)
            x1: 500, y1: 300,
            x2: 500, y2: 500
        },
        {
            // Bottom mirror (horizontal)
            x1: 500, y1: 500,
            x2: 300, y2: 500
        },
        {
            // Left mirror (vertical)
            x1: 300, y1: 500,
            x2: 300, y2: 300
        }
    ],
    viewers: [
        {
            // Viewer positioned inside the box
            x: 400,
            y: 400,
            radius: 8,
            fill: '#4a90e2'
        }
    ],
    lightBeams: []
};
