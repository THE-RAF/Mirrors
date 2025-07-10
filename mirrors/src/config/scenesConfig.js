/**
 * @file scenesConfig.js - Default scene configuration
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const sceneEntities = {
    objects: [
        {
            // Triangle in the center
            vertices: createTriangle({ center: { x: 384, y: 388 } }), // 48% = 384px, 48.5% = 388px
            fill: '#ff6b6b'
        },
        {
            // Square on the right
            vertices: createSquare({ center: { x: 416, y: 376 } }), // 52% = 416px, 47% = 376px
            fill: '#ffcc00',
        }
    ],
    mirrors: [
        {
            // Vertical mirror in the left side
            x1: 300, y1: 500,    // Center vertical line
            x2: 300, y2: 300,    // From 200px to 600px height
        },
        {
            // Horizontal mirror at the top
            x1: 300, y1: 300,    // Center horizontal line
            x2: 500, y2: 300,    // From 200px to 600px width
        },
        {
            // vertical mirror in the right side
            x1: 500, y1: 300,    // Center vertical line
            x2: 500, y2: 500,    // From 200px to 600px height
        },
        {
            // Horizontal mirror at the bottom
            x1: 500, y1: 500,    // Center horizontal line
            x2: 300, y2: 500,    // From 200px to 600px width
        }
    ],
    viewer: {
        // Viewer below the triangle
        x: 400,    // 50% = 400px
        y: 424,    // 53% = 424px
        radius: 12,
        fill: '#007acc',
        stroke: '#005a99',
        strokeWidth: 2
    }
};
