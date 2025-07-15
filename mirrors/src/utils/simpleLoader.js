/**
 * @file simpleLoader.js - Ultra-simple scene loader and simulation creator
 * Main exports: loadSceneAndCreateSimulation
 */

import { SimpleReflectionMode } from '../simulationModes/simpleReflectionMode.js';

// Scene imports
import { basicReflection } from '../config/scenes/basicReflection.js';
import { diagonalReflection } from '../config/scenes/diagonalReflection.js';
import { mirrorBox } from '../config/scenes/mirrorBox.js';
import { triangularBox } from '../config/scenes/triangularBox.js';

const scenes = {
    'basic-reflection': basicReflection,
    'diagonal-reflection': diagonalReflection,
    'mirror-box': mirrorBox,
    'triangular-box': triangularBox
};

/**
 * Loads a scene by name, validates mode compatibility, and creates appropriate simulation
 * @param {Object} config
 * @param {string} config.sceneName - Scene identifier like 'basic-reflection'
 * @param {Object} config.modeConfigs - Mode configurations object
 * @param {SVGElement} config.svgCanvas - SVG canvas element for rendering
 * @returns {SimpleReflectionMode|InfiniteReflectionMode} Configured simulation instance
 */
export function loadSceneAndCreateSimulation({ sceneName, modeConfigs, svgCanvas }) {
    // Get scene
    const scene = scenes[sceneName];
    if (!scene) {
        throw new Error(`Scene "${sceneName}" not found`);
    }

    // Validate mode compatibility
    const modeConfig = modeConfigs[scene.mode];
    if (!modeConfig) {
        throw new Error(`Mode "${scene.mode}" not configured`);
    }

    let simulation = new SimpleReflectionMode({ sceneEntities: scene, modeConfig, svgCanvas });

    return simulation;
}
