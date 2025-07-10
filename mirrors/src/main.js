/**
 * @file main.js - Mirror Reflection Sandbox main entry point
 */

import { MainSimulation } from './simulation/mainSimulation.js';
import { MainSimulation2 } from './simulation2/mainSimulation2.js';
import { sceneEntities } from './config/scenesConfig.js';
import { generalConfig } from './config/generalConfig.js';

// Create and initialize the simulation
// const simulation = new MainSimulation({
//     canvas: document.getElementById('mirror-canvas'),
//     ...sceneEntities
// });

const simulation = new MainSimulation2({
    sceneEntities: sceneEntities,
    svgCanvas: document.getElementById('mirror-canvas'),
    generalConfig: generalConfig
});

simulation.init();
