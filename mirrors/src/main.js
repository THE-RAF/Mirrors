/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { MainSimulation } from './simulation/mainSimulation.js';
import { defaultScene } from './config/sceneConfig.js';

// Create and initialize the simulation
const simulation = new MainSimulation({
    canvas: document.getElementById('mirror-canvas'),
    width: 800,
    height: 800,
    ...defaultScene
});

simulation.init();
