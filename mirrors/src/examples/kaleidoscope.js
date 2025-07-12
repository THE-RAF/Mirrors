/**
 * @file examples/kaleidoscope.js - Kaleidoscope example with symmetric mirrors
 */

import { createTriangle } from '../utils/geometry.js';

export const kaleidoscopeExample = {
    name: "Kaleidoscope",
    description: "Symmetric mirror arrangement creating kaleidoscope effects",
    
    sceneEntities: {
        objects: [
            {
                // Small colorful triangle in center
                vertices: createTriangle({ center: { x: 400, y: 400 }, size: 30 }),
                fill: '#ff4757'
            },
            {
                // Another small triangle
                vertices: createTriangle({ center: { x: 420, y: 380 }, size: 20 }),
                fill: '#5f27cd'
            }
        ],
        mirrors: [
            // Create 6 mirrors in a hexagonal pattern
            {
                // Mirror 1 - Top
                x1: 400, y1: 250,
                x2: 400, y2: 350,
            },
            {
                // Mirror 2 - Top-right
                x1: 400, y1: 250,
                x2: 487, y2: 300,
            },
            {
                // Mirror 3 - Bottom-right
                x1: 487, y1: 300,
                x2: 487, y2: 500,
            },
            {
                // Mirror 4 - Bottom
                x1: 487, y1: 500,
                x2: 313, y2: 500,
            },
            {
                // Mirror 5 - Bottom-left
                x1: 313, y1: 500,
                x2: 313, y2: 300,
            },
            {
                // Mirror 6 - Top-left
                x1: 313, y1: 300,
                x2: 400, y2: 250,
            }
        ],
        viewers: [
            {
                // Viewer in center
                x: 400,
                y: 400,
                radius: 8,
                fill: '#2f3542'
            }
        ],
        lightBeams: []
    },
    
    modeConfig: {
        interaction: {
            draggablePolygons: true,
            draggableMirrors: false, // Keep mirrors fixed for kaleidoscope effect
            draggableViewers: true
        },
        lightBeamProjector: {
            enabled: true,
            config: {
                virtualBeam: {
                    color: '#ff6348',
                    strokeWidth: 1.5,
                    animationDuration: 800,
                    tolerance: 8
                },
                realBeam: {
                    color: '#ffa502',
                    strokeWidth: 1.5,
                    animationDuration: 800
                }
            }
        }
    }
};
