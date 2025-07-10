/**
 * @file scenesConfig.js - Default scene configuration
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const sceneEntities = {
    objects: [
        {
            // Triangle in the center
            vertices: createTriangle({ center: { x: 384, y: 388 } }), // 48% = 384px, 48.5% = 388px
            fill: '#ff6b6b',
            stroke: '#333',
            strokeWidth: 2
        },
        {
            // Square on the right
            vertices: createSquare({ center: { x: 416, y: 376 } }), // 52% = 416px, 47% = 376px
            fill: '#ffcc00',
            stroke: '#333',
            strokeWidth: 2
        }
    ],
    mirrors: [
        {
            // Vertical mirror at 40% of canvas width
            x1: 320, y1: 0,    // 40% = 320px, 0% = 0px
            x2: 320, y2: 800,  // 40% = 320px, 100% = 800px
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Vertical mirror at 60% of canvas width
            x1: 480, y1: 0,    // 60% = 480px, 0% = 0px
            x2: 480, y2: 800,  // 60% = 480px, 100% = 800px
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Horizontal mirror at 40% of canvas height
            x1: 0, y1: 320,    // 0% = 0px, 40% = 320px
            x2: 800, y2: 320,  // 100% = 800px, 40% = 320px
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Horizontal mirror at 60% of canvas height
            x1: 0, y1: 480,    // 0% = 0px, 60% = 480px
            x2: 800, y2: 480,  // 100% = 800px, 60% = 480px
            stroke: '#2c3e50',
            strokeWidth: 3
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
