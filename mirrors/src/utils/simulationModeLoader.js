/**
 * @file simulationModeLoader.js - Load and manage different simulation modes
 */

import { SimpleReflectionMode } from '../simulations/simpleReflectionMode.js';
import { InfiniteReflectionMode } from '../simulations/infiniteReflectionMode.js';

/**
 * Available simulation modes
 */
export const SIMULATION_MODES = {
    SIMPLE: 'simple',
    INFINITE: 'infinite'
};

/**
 * Load and initialize the appropriate simulation mode
 * @param {Object} config
 * @param {string} config.mode - The simulation mode to load ('simple' or 'infinite')
 * @param {Object} config.sceneEntities - Scene configuration containing objects
 * @param {Object} config.modeConfig - Mode-specific configuration
 * @param {SVGElement} config.svgCanvas - SVG element for rendering
 * @returns {SimpleReflectionMode|InfiniteReflectionMode} The initialized simulation instance
 */
export function loadSimulationMode({ mode, sceneEntities, modeConfig, svgCanvas }) {
    console.log(`Loading simulation mode: ${mode}`);
    
    switch (mode) {
        case SIMULATION_MODES.SIMPLE:
            return new SimpleReflectionMode({
                sceneEntities,
                modeConfig,
                svgCanvas
            });
            
        case SIMULATION_MODES.INFINITE:
            return new InfiniteReflectionMode({
                sceneEntities,
                modeConfig,
                svgCanvas
            });
            
        default:
            console.warn(`Unknown simulation mode: ${mode}. Falling back to simple mode.`);
            return new SimpleReflectionMode({
                sceneEntities,
                modeConfig,
                svgCanvas
            });
    }
}

/**
 * Determine the appropriate simulation mode based on configuration
 * @param {Object} modeConfig - Mode-specific configuration
 * @returns {string} The recommended simulation mode
 */
export function detectSimulationMode({ modeConfig }) {
    // If infinite reflections are explicitly enabled, use infinite mode
    if (modeConfig.infiniteReflections?.enabled === true) {
        return SIMULATION_MODES.INFINITE;
    }
    
    // Otherwise, use simple mode
    return SIMULATION_MODES.SIMPLE;
}
