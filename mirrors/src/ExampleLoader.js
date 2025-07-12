/**
 * @file ExampleLoader.js - Load and manage simulation examples
 */

import { basicReflectionExample } from './examples/basicReflection.js';
import { diagonalReflectionExample } from './examples/diagonalReflection.js';
import { mirrorBoxExample } from './examples/mirrorBox.js';

// Collection of all available examples
export const examples = {
    'basic-reflection': basicReflectionExample,
    'diagonal-reflection': diagonalReflectionExample,
    'mirror-box': mirrorBoxExample,
};

/**
 * Get an example by its key
 * @param {Object} config
 * @param {string} config.exampleKey - The key of the example to load
 * @returns {Object} The example configuration
 * @throws {Error} If example key is not found
 */
export function getExample({ exampleKey }) {
    if (!examples[exampleKey]) {
        const availableKeys = Object.keys(examples).join(', ');
        throw new Error(`Example "${exampleKey}" not found. Available examples: ${availableKeys}`);
    }
    
    return examples[exampleKey];
}

/**
 * Get list of all available example keys with their names
 * @returns {Array} Array of {key, name, description} objects
 */
export function getAvailableExamples() {
    return Object.entries(examples).map(([key, example]) => ({
        key,
        name: example.name,
        description: example.description
    }));
}

/**
 * Load example configuration for the simulation
 * @param {Object} config
 * @param {string} config.exampleKey - The key of the example to load
 * @returns {Object} Object with sceneEntities and modeConfig
 */
export function loadExample({ exampleKey }) {
    const example = getExample({ exampleKey });
    
    console.log(`📋 Loading example: ${example.name}`);
    console.log(`📝 Description: ${example.description}`);
    
    return {
        sceneEntities: example.sceneEntities,
        modeConfig: example.modeConfig
    };
}
