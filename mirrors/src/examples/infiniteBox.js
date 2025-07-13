/**
 * @file examples/infiniteBox.js - Infinite reflections example
 * 
 * ⚠️  EXPERIMENTAL EXAMPLE ⚠️
 * This example uses the experimental InfiniteReflectionEngine.
 * May cause performance issues or unexpected behavior.
 */

import { createStar, createHeart } from '../utils/geometryFactory.js';

export const infiniteBoxExample = {
    name: "Infinite Box ⚠️ EXPERIMENTAL",
    description: "4-mirror box with infinite reflections creating kaleidoscope patterns (EXPERIMENTAL FEATURE)",
    
    sceneEntities: {
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
                fill: '#ffcc00',
            }
        ],
        mirrors: [
            {
                // Top mirror (horizontal)
                x1: 300, y1: 300,
                x2: 500, y2: 300,
            },
            {
                // Right mirror (vertical)
                x1: 500, y1: 300,
                x2: 500, y2: 500,
            },
            {
                // Bottom mirror (horizontal)
                x1: 500, y1: 500,
                x2: 300, y2: 500,
            },
            {
                // Left mirror (vertical)
                x1: 300, y1: 500,
                x2: 300, y2: 300,
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
        infiniteReflections: { // Experimental feature, may cause performance issues or unexpected behavior
            enabled: true,
            maxDepth: 3,
            fadeRate: 0.6,
            minOpacity: 0.05
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
