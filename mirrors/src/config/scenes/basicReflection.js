/**
 * @file config/scenes/basicReflection.js - Basic reflection scene
 * Simple layout with triangle, square, trapezoid and a vertical mirror
 */

export const basicReflection = {
    mode: 'generalReflections',
    objects: [
        {
            // Triangle
            vertices: [
                { x: 200, y: 200 },
                { x: 300, y: 100 },
                { x: 300, y: 200 }
            ],
            fill: '#ff6b6b'
        },
        {
            // Square
            vertices: [
                { x: 250, y: 350 },
                { x: 350, y: 350 },
                { x: 350, y: 450 },
                { x: 250, y: 450 }
            ],
            fill: '#ffcc00'
        },
        {
            // Trapezoid
            vertices: [
                { x: 50, y: 250 },
                { x: 100, y: 250 },
                { x: 150, y: 350 },
                { x: 50, y: 350 }
            ],
            fill: '#00ccff'
        }
    ],
    mirrors: [
        {
            // Vertical mirror at the center
            x1: 400, y1: 0,
            x2: 400, y2: 800
        }
    ],
    viewers: [
        {
            // Main viewer position
            x: 200,
            y: 600,
            radius: 50,
            fill: '#4a90e2'
        }
    ],
    lightBeams: []
};
