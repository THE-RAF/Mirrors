/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { MainSimulation } from './simulation/mainSimulation.js';
import { sceneEntities } from './config/scenesConfig.js';
import { generalConfig } from './config/generalConfig.js';

const svgCanvas = document.getElementById('mirror-canvas');
svgCanvas.setAttribute('width', generalConfig.canvas.width);
svgCanvas.setAttribute('height', generalConfig.canvas.height);

const simulation = new MainSimulation({
    sceneEntities: sceneEntities,
    svgCanvas: svgCanvas,
    generalConfig: generalConfig
});

simulation.init();
