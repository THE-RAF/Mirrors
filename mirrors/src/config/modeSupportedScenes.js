/**
 * @file config/modeSupportedScenes.js - Scene compatibility matrix
 * Defines WHICH scenes each mode works with
 */

export const modeSupportedScenes = {
    'simpleReflections': ['basic-reflection', 'diagonal-reflection', 'mirror-box', 'triangular-box'],
    'infiniteReflections': ['basic-reflection', 'diagonal-reflection', 'mirror-box', 'triangular-box', 'infinite-box'],
    // Future modes can declare their supported scenes here
};
