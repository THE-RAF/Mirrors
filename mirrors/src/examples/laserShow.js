/**
 * @file examples/laserShow.js - Laser show example with multiple light beams
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

export const laserShowExample = {
    name: "Laser Show",
    description: "Multiple light beams with dynamic projections and reflections",
    
    sceneEntities: {
        objects: [
            {
                // Central diamond-like square
                vertices: createSquare({ center: { x: 400, y: 400 }, size: 40, rotation: 45 }),
                fill: '#ff3838'
            }
        ],
        mirrors: [
            {
                // Left mirror
                x1: 200, y1: 300,
                x2: 200, y2: 500,
            },
            {
                // Right mirror  
                x1: 600, y1: 300,
                x2: 600, y2: 500,
            },
            {
                // Top mirror
                x1: 300, y1: 200,
                x2: 500, y2: 200,
            },
            {
                // Bottom mirror
                x1: 300, y1: 600,
                x2: 500, y2: 600,
            }
        ],
        viewers: [
            {
                // Bottom-left viewer
                x: 250,
                y: 550,
                radius: 10,
                fill: '#2f3542'
            },
            {
                // Top-right viewer
                x: 550,
                y: 250,
                radius: 10,
                fill: '#2f3542'
            }
        ],
        lightBeams: [
            {
                // Horizontal beam from left
                emissionPoint: { x: 50, y: 400 },
                directorVector: { x: 1, y: 0 },
                maxLength: 700,
                strokeColor: '#ff4757',
                strokeWidth: 3,
                animated: true,
                animationDuration: 1500
            },
            {
                // Diagonal beam from bottom left
                emissionPoint: { x: 150, y: 650 },
                directorVector: { x: 0.7, y: -0.7 },
                maxLength: 600,
                strokeColor: '#3742fa',
                strokeWidth: 3,
                animated: true,
                animationDuration: 1200
            },
            {
                // Vertical beam from top
                emissionPoint: { x: 400, y: 50 },
                directorVector: { x: 0, y: 1 },
                maxLength: 700,
                strokeColor: '#2ed573',
                strokeWidth: 3,
                animated: true,
                animationDuration: 1800
            }
        ]
    },
    
    modeConfig: {
        interaction: {
            draggablePolygons: true,
            draggableMirrors: true,
            draggableViewers: true
        },
        lightBeamProjector: {
            enabled: true,
            config: {
                virtualBeam: {
                    color: '#ff9ff3',
                    strokeWidth: 2.5,
                    animationDuration: 1000,
                    tolerance: 12
                },
                realBeam: {
                    color: '#54a0ff',
                    strokeWidth: 2.5,
                    animationDuration: 1000
                }
            }
        }
    }
};
