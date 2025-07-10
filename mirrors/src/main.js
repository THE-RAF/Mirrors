/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { MainSimulation } from './simulation/mainSimulation.js';
import { defaultScene } from './config/scenesConfig.js';
import { generalConfig } from './config/generalConfig.js';

// Create and initialize the simulation
const simulation = new MainSimulation({
    canvas: document.getElementById('mirror-canvas'),
    width: generalConfig.canvas.width,
    height: generalConfig.canvas.height,
    ...defaultScene
});

simulation.init();
