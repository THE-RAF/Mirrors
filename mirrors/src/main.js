/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 * Ultra-simple architecture - everything inline for maximum clarity
 */

import { generalConfig } from './config/generalConfig.js';
import { modeConfigs } from './config/modeConfigs.js';
import { loadSceneAndCreateSimulation } from './utils/simpleLoader.js';

// Setup canvas
const svgCanvas = document.getElementById('mirror-canvas');
svgCanvas.setAttribute('width', generalConfig.canvas.width);
svgCanvas.setAttribute('height', generalConfig.canvas.height);

const simulation = loadSceneAndCreateSimulation({ 
    sceneName: generalConfig.currentExample, 
    modeConfigs, 
    svgCanvas 
});

simulation.init();
