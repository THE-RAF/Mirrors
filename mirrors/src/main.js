/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { SimpleReflectionMode } from './simulations/simpleReflectionMode.js';
import { sceneEntities, modeConfig } from './config/simpleReflectionModeConfig.js';
import { generalConfig } from './config/generalConfig.js';

const svgCanvas = document.getElementById('mirror-canvas');
svgCanvas.setAttribute('width', generalConfig.canvas.width);
svgCanvas.setAttribute('height', generalConfig.canvas.height);

const simulation = new SimpleReflectionMode({
    sceneEntities: sceneEntities,
    modeConfig: modeConfig,
    svgCanvas: svgCanvas,
});

simulation.init();
