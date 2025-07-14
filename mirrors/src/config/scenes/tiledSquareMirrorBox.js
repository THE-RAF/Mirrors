/**
 * @file config/scenes/tiledSquareMirrorBox.js - Tiled square mirror box scene
 * Simple square box with objects inside for tiling-based infinite reflections
 */

import { createTriangle, createSquare } from '../../utils/geometryFactory.js';

export const tiledSquareMirrorBox = {
    mode: 'squareMirrorBox',
    objects: [
        {
            // Small triangle inside the box
            vertices: createTriangle({ center: { x: 400, y: 380 }, size: 15 }),
            fill: '#ff6b6b'
        },
        {
            // Small square inside the box
            vertices: createSquare({ center: { x: 420, y: 420 }, size: 20 }),
            fill: '#4ecdc4'
        }
    ],
    viewers: [
        {
            // Small viewer inside the box
            x: 380,
            y: 420,
            radius: 8,
            fill: '#4a90e2'
        }
    ],
    // Box configuration for rectangular mirror box
    boxConfig: {
        center: { x: 400, y: 400 },  // Configurable center position
        boxWidth: 200,               // Width of the rectangular box
        boxHeight: 200               // Height of the rectangular box
    }
};
