/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { MainSimulation } from './simulation/mainSimulation.js';
import { defaultScene } from './config/sceneConfig.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mirror-canvas');
    
    if (!canvas) {
        console.error('SVG canvas not found');
        return;
    }
    
    console.log('Canvas found, initializing simulation...');
    
    // Create and initialize the simulation
    const simulation = new MainSimulation({
        canvas: canvas,
        width: 800,
        height: 800,
        ...defaultScene
    });
    
    simulation.init();
    
    // Make simulation available globally for debugging
    window.simulation = simulation;
    
    console.log('Application initialized successfully - try dragging the objects!');
});