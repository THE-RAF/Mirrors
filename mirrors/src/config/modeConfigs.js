/**
 * @file config/modeConfigs.js - Pure mode behavior configurations
 * Defines HOW each mode behaves (interaction, reflection settings, etc.)
 */

export const modeConfigs = {
    'simpleReflections': {
        interaction: {
            draggablePolygons: true,
            draggableMirrors: true,
            draggableViewers: true
        },
        reflections: {
            enabled: true,
            recursiveReflectionDepth: 2
        },
        lightBeamProjector: {
            enabled: true,
            config: {
                virtualBeam: {
                    color: '#fa6c00',
                    strokeWidth: 2,
                    animationDuration: 1000,
                    tolerance: 10
                },
                realBeam: {
                    color: '#ffdd00',
                    strokeWidth: 2,
                    animationDuration: 1000
                }
            }
        }
    },

    'infiniteReflections': { // ⚠️ Experimental mode, may cause performance issues or unexpected behavior
        interaction: {
            draggablePolygons: true,
            draggableMirrors: true,
            draggableViewers: true
        },
        reflections: {
            enabled: true
        },
        infiniteReflections: {
            enabled: true,
            maxDepth: 3,
            fadeRate: 0.6,
            minOpacity: 0.05
        },
        lightBeamProjector: {
            enabled: true,
            config: {
                virtualBeam: {
                    color: '#fa6c00',
                    strokeWidth: 2,
                    animationDuration: 1000,
                    tolerance: 10
                },
                realBeam: {
                    color: '#ffdd00',
                    strokeWidth: 2,
                    animationDuration: 1000
                }
            }
        }
    },

    'squareMirrorBox': {
        interaction: {
            draggableObjects: true,  // Only objects inside the central box
            draggableMirrors: false, // Box structure is fixed
            draggableViewers: false  // No viewers in this mode
        },
        tiling: {
            enabled: true,
            boxSize: 200,           // Square box dimensions in pixels
            tilesPerDirection: 4    // Create 4x4 grid of tiled boxes
        },
        lightBeamProjector: {
            enabled: false          // Simplified mode without light beams
        }
    }
};
