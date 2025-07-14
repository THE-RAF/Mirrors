/**
 * @file config/scenes/mirrorBox.js - Regular mirror box scene
 * Four-mirror box with triangle and square (uses simple reflections, not infinite)
 */

import { createTriangle, createSquare } from '../../utils/geometryFactory.js';

export const mirrorBox = {
    mode: 'simpleReflections',
    objects: [
        {
            // Triangle
            vertices: createTriangle({ center: { x: 400, y: 350 } }),
            fill: '#ff6b6b'
        },
        {
            // Square
            vertices: createSquare({ center: { x: 350, y: 400 } }),
            fill: '#ffcc00'
        }
    ],
    mirrors: [
        {
            // Vertical mirror at the right
            x1: 500, y1: 300,
            x2: 500, y2: 500
        },
        {
            // Horizontal mirror at the top
            x1: 300, y1: 300,
            x2: 500, y2: 300
        },
        {
            // Vertical mirror at the left
            x1: 300, y1: 500,
            x2: 300, y2: 300
        },
        {
            // Horizontal mirror at the bottom
            x1: 500, y1: 500,
            x2: 300, y2: 500
        }
    ],
    viewers: [
        {
            // Main viewer position
            x: 450,
            y: 450,
            radius: 12,
            fill: '#4a90e2'
        }
    ],
    lightBeams: []
};
