/**
 * @file simpleReflectionModeConfig.js - Configuration for simple reflection mode
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const modeConfig = {
    interaction: {
        draggablePolygons: true,
        draggableMirrors: false
    }
};

export const sceneEntities = {
    objects: [
        {
            // Triangle
            vertices: createTriangle({ center: { x: 300, y: 400 } }),
            fill: '#ff6b6b'
        },
        {
            // Square
            vertices: createSquare({ center: { x: 250, y: 350 } }),
            fill: '#ffcc00',
        }
    ],
    mirrors: [
        {
            // Vertical mirror in the center
            x1: 400, y1: 300,
            x2: 400, y2: 500,
        }
    ]
};
