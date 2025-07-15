/**
 * @file config/scenes/diagonalReflection.js - Diagonal reflection scene
 * Diagonal mirror setup with star, diamond, and pentagon shapes
 */

import { createStar, createDiamond, createPentagon } from '../../utils/geometryFactory.js';

export const diagonalReflection = {
    mode: 'generalReflections',
    objects: [
        {
            // Star shape - positioned in upper left
            vertices: createStar({ 
                center: { x: 300, y: 140 }, 
                outerRadius: 35, 
                innerRadius: 15, 
                points: 5 
            }),
            fill: '#ff6b6b'
        },
        {
            // Diamond shape - positioned in middle left
            vertices: createDiamond({ 
                center: { x: 150, y: 280 }, 
                size: 30 
            }),
            fill: '#ffcc00'
        },
        {
            // Pentagon shape - positioned in lower left
            vertices: createPentagon({ 
                center: { x: 120, y: 480 }, 
                size: 40 
            }),
            fill: '#00ccff'
        }
    ],
    mirrors: [
        {
            // Diagonal mirror from top-right to bottom-left
            x1: 700, y1: 100,
            x2: 100, y2: 700
        }
    ],
    viewers: [
        {
            // Viewer positioned to observe diagonal reflections
            x: 500,
            y: 150,
            radius: 20,
            fill: '#4a90e2'
        }
    ],
    lightBeams: []
};
