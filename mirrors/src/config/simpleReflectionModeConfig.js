/**
 * @file simpleReflectionModeConfig.js - Configuration for simple reflection mode
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const modeConfig = {
    interaction: {
        draggablePolygons: true,
        draggableMirrors: true,
        draggableViewers: true
    },
    lightBeamProjectorConfig: {
        virtualBeam: {
            color: '#ff4444',
            strokeWidth: 2,
            animationDuration: 1000,
            tolerance: 10 // px tolerance for endpoint validation
        },
        realBeam: {
            color: '#ffdd00',
            strokeWidth: 2,
            animationDuration: 1000
        }
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
            x2: 350, y2: 500,
        },
        {
            // Horizontal mirror at the top
            x1: 300, y1: 300,
            x2: 500, y2: 300,
        }
    ],
    viewers: [
        {
            // Main viewer position
            x: 180,
            y: 320,
            radius: 12,
            fill: '#4a90e2'
        }
    ],
    lightBeams: [
        // {
        //     // Horizontal beam from left
        //     emissionPoint: { x: 150, y: 400 },
        //     directorVector: { x: 1, y: 0 },
        //     maxLength: 800,
        //     strokeColor: '#ffdd00',
        //     strokeWidth: 2,
        //     animated: true,
        //     animationDuration: 1000
        // },
        // {
        //     // Diagonal beam from bottom left
        //     emissionPoint: { x: 200, y: 500 },
        //     directorVector: { x: 0.8, y: -0.6 },
        //     maxLength: 600,
        //     strokeColor: '#00ff88',
        //     strokeWidth: 2,
        //     animated: true,
        //     animationDuration: 1000
        // }
    ]
};
