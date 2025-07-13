/**
 * @file examples/mirrorBox.js - Mirror box reflection example
 */

import { createTriangle, createSquare } from '../utils/geometryFactory.js';

export const mirrorBoxExample = {
    name: "Mirror box",
    description: "4 mirror box with a triangle, a square and a viewer inside",
    
    sceneEntities: {
        objects: [
            {
                // Triangle
                vertices: createTriangle({ center: { x: 400, y: 350 } }),
                fill: '#ff6b6b'
            },
            {
                // Square
                vertices: createSquare({ center: { x: 350, y: 400 } }),
                fill: '#ffcc00',
            }
        ],
        mirrors: [
            {
                // Vertical mirror at the right
                x1: 500, y1: 300,
                x2: 500, y2: 500,
            },
            {
                // Horizontal mirror at the top
                x1: 300, y1: 300,
                x2: 500, y2: 300,
            },
            {
                // vertical mirror at the left
                x1: 300, y1: 500,
                x2: 300, y2: 300,
            },
            {
                // Horizontal mirror at the bottom
                x1: 500, y1: 500,
                x2: 300, y2: 500,
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
    },
    
    modeConfig: {
        interaction: {
            draggablePolygons: true,
            draggableMirrors: true,
            draggableViewers: true
        },
        reflections: {
            enabled: true
        },
        lightBeamProjector: {
            enabled: true,
            config: {
                virtualBeam: {
                    color: '#fa6c00',
                    strokeWidth: 2,
                    animationDuration: 1000,
                    tolerance: 10
                },
                realBeam: {
                    color: '#ffdd00',
                    strokeWidth: 2,
                    animationDuration: 1000
                }
            }
        }
    }
};
