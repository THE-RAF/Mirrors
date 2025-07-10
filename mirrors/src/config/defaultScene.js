/**
 * @file defaultScene.js - Default scene configuration
 */

import { createTriangle, createSquare } from '../utils/geometry.js';

// Object positions
const triangleCenter = { x: '48%', y: '48.5%' };
const squareCenter = { x: '52%', y: '47%' };
const viewerCenter = { x: '50%', y: '53%' };

export const defaultScene = {
    objects: [
        {
            // Triangle in the center
            vertices: createTriangle({ center: triangleCenter }),
            fill: '#ff6b6b',
            stroke: '#333',
            strokeWidth: 2
        },
        {
            // Square on the right
            vertices: createSquare({ center: squareCenter }),
            fill: '#ffcc00',
            stroke: '#333',
            strokeWidth: 2
        }
    ],
    mirrors: [
        {
            // Vertical mirror at 40% of canvas width
            x1: '40%', y1: '0%',
            x2: '40%', y2: '100%',
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Vertical mirror at 60% of canvas width
            x1: '60%', y1: '0%',
            x2: '60%', y2: '100%',
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Horizontal mirror at 40% of canvas height
            x1: '0%', y1: '40%',
            x2: '100%', y2: '40%',
            stroke: '#2c3e50',
            strokeWidth: 3
        },
        {
            // Horizontal mirror at 60% of canvas height
            x1: '0%', y1: '60%',
            x2: '100%', y2: '60%',
            stroke: '#2c3e50',
            strokeWidth: 3
        }
    ],
    viewer: {
        // Viewer below the triangle
        x: viewerCenter.x,
        y: viewerCenter.y,
        radius: 12,
        fill: '#007acc',
        stroke: '#005a99',
        strokeWidth: 2
    }
};
