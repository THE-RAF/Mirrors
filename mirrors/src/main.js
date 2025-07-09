/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 * Main application initialization and simulation setup
 */

import { MainSimulation } from './simulation/mainSimulation.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mirror-canvas');
    
    if (!canvas) {
        console.error('SVG canvas not found');
        return;
    }
    
    console.log('Canvas found, initializing simulation...');
    
    // Object centers for easy positioning
    const triangleCenter = {
        x: '48%',
        y: '48.5%'  // Center of triangle
    };
    
    const squareCenter = {
        x: '52%',
        y: '47%'
    };

    const viewerCenter = {
        x: '50%',
        y: '53%'
    };

    // Helper function to create triangle vertices from center
    function createTriangle(center, size = 3) {
        return [
            { x: center.x, y: `${parseFloat(center.y) - size/2}%` },  // Top vertex
            { x: `${parseFloat(center.x) - size/2}%`, y: `${parseFloat(center.y) + size/2}%` },  // Bottom left
            { x: `${parseFloat(center.x) + size/2}%`, y: `${parseFloat(center.y) + size/2}%` }   // Bottom right
        ];
    }
    
    // Helper function to create square vertices from center
    function createSquare(center, size = 4) {
        const halfSize = size / 3;
        return [
            { x: `${parseFloat(center.x) - halfSize}%`, y: `${parseFloat(center.y) - halfSize}%` },  // Top left
            { x: `${parseFloat(center.x) + halfSize}%`, y: `${parseFloat(center.y) - halfSize}%` },  // Top right
            { x: `${parseFloat(center.x) + halfSize}%`, y: `${parseFloat(center.y) + halfSize}%` },  // Bottom right
            { x: `${parseFloat(center.x) - halfSize}%`, y: `${parseFloat(center.y) + halfSize}%` }   // Bottom left
        ];
    }

    // Scene configuration
    const sceneConfig = {
        objects: [
            {
                // Triangle in the center
                vertices: createTriangle(triangleCenter),
                fill: '#ff6b6b',
                stroke: '#333',
                strokeWidth: 2
            },
            {
                // Square on the right
                vertices: createSquare(squareCenter),
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
    
    // Create and initialize the simulation
    const simulation = new MainSimulation({
        canvas: canvas,
        width: 800,
        height: 800,
        ...sceneConfig
    });
    
    // Initialize the simulation with configured objects
    simulation.init();
    
    // Make simulation available globally for debugging
    window.simulation = simulation;
    
    console.log('Application initialized successfully - try dragging the objects!');
});