/**
 * @file examples/geometryPlayground.js - Geometry playground with various shapes
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const geometryPlaygroundExample = {
    name: "Geometry Playground",
    description: "Various geometric shapes with simple mirror setup for experimentation",
    
    sceneEntities: {
        objects: [
            {
                // Large triangle
                vertices: createTriangle({ center: { x: 300, y: 300 }, size: 60 }),
                fill: '#ff6b6b'
            },
            {
                // Medium square
                vertices: createSquare({ center: { x: 500, y: 300 }, size: 50 }),
                fill: '#4ecdc4'
            },
            {
                // Small triangle
                vertices: createTriangle({ center: { x: 400, y: 500 }, size: 30 }),
                fill: '#45b7d1'
            },
            {
                // Rotated square
                vertices: createSquare({ center: { x: 350, y: 450 }, size: 35, rotation: 45 }),
                fill: '#f9ca24'
            },
            {
                // Another triangle
                vertices: createTriangle({ center: { x: 450, y: 350 }, size: 25 }),
                fill: '#6c5ce7'
            }
        ],
        mirrors: [
            {
                // Single vertical mirror in center
                x1: 400, y1: 200,
                x2: 400, y2: 600,
            },
            {
                // Horizontal mirror 
                x1: 250, y1: 400,
                x2: 550, y2: 400,
            }
        ],
        viewers: [
            {
                // Mobile viewer
                x: 350,
                y: 350,
                radius: 15,
                fill: '#2d3436'
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
        lightBeamProjector: {
            enabled: false, // Disabled for pure geometry focus
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
