/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { SimpleReflectionMode } from './simulations/simpleReflectionMode.js';
import { loadExample, getAvailableExamples } from './ExampleLoader.js';
import { generalConfig } from './config/generalConfig.js';

// Set up canvas
const svgCanvas = document.getElementById('mirror-canvas');
svgCanvas.setAttribute('width', generalConfig.canvas.width);
svgCanvas.setAttribute('height', generalConfig.canvas.height);

// Load the selected example
const { sceneEntities, modeConfig } = loadExample({ exampleKey: generalConfig.currentExample });

// Initialize simulation with loaded example
const simulation = new SimpleReflectionMode({
    sceneEntities: sceneEntities,
    modeConfig: modeConfig,
    svgCanvas: svgCanvas,
});

simulation.init();
