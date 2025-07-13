/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { loadSimulationMode, detectSimulationMode, getSimulationModeInfo } from './utils/simulationModeLoader.js';
import { loadExample, getAvailableExamples } from './ExampleLoader.js';
import { generalConfig } from './config/generalConfig.js';

// Set up canvas
const svgCanvas = document.getElementById('mirror-canvas');
svgCanvas.setAttribute('width', generalConfig.canvas.width);
svgCanvas.setAttribute('height', generalConfig.canvas.height);

// Load the selected example
const { sceneEntities, modeConfig } = loadExample({ exampleKey: generalConfig.currentExample });

// Detect and load the appropriate simulation mode
const simulationMode = detectSimulationMode({ modeConfig });
console.log(`Detected simulation mode: ${simulationMode}`);

// Log mode information
const modeInfo = getSimulationModeInfo();
console.log(`Mode info:`, modeInfo[simulationMode]);

// Initialize simulation with the appropriate mode
const simulation = loadSimulationMode({
    mode: simulationMode,
    sceneEntities: sceneEntities,
    modeConfig: modeConfig,
    svgCanvas: svgCanvas,
});

simulation.init();
