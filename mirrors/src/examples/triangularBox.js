/**
 * @file examples/triangularBox.js - Triangular mirror box example
 */

import { createStar, createHeart, createDiamond } from '../utils/geometryFactory.js';

export const triangularBoxExample = {
    name: "Triangular Box",
    description: "3 mirror triangular box with shapes creating kaleidoscope patterns",
    
    sceneEntities: {
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
                fill: '#ffcc00',
            },
            {
                // Diamond shape - positioned near edge
                vertices: createDiamond({ 
                    center: { x: 400, y: 460 }, 
                    size: 20 
                }),
                fill: '#00ccff',
            }
        ],
        mirrors: [
            {
                // Top mirror (horizontal-ish, angled)
                x1: 250, y1: 280,
                x2: 550, y2: 280,
            },
            {
                // Bottom left mirror (angled down-right)
                x1: 400, y1: 550,
                x2: 250, y2: 280,
            },
            {
                // Bottom right mirror (angled down-left)
                x1: 550, y1: 280,
                x2: 400, y2: 550,
            }
        ],
        viewers: [
            {
                // Viewer positioned inside the triangle
                x: 400,
                y: 364,
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
        infiniteReflections: { // Experimental feature, may cause performance issues or unexpected behavior
            enabled: true,
            maxDepth: 3,
            fadeRate: 0.7,
            minOpacity: 0.1
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
