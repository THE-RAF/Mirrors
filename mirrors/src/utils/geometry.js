/**
 * @file geometry.js - Simple geometry helper functions
 */

/**
 * Create triangle vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=24] - Triangle size in pixels
 * @returns {Array} Array of triangle vertices
 */
export function createTriangle({ center, size = 24 }) {
    return [
        { x: center.x, y: center.y - size/2 },  // Top vertex
        { x: center.x - size/2, y: center.y + size/2 },  // Bottom left
        { x: center.x + size/2, y: center.y + size/2 }   // Bottom right
    ];
}

/**
 * Create square vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=32] - Square size in pixels
 * @returns {Array} Array of square vertices
 */
export function createSquare({ center, size = 32 }) {
    const halfSize = size / 3;
    return [
        { x: center.x - halfSize, y: center.y - halfSize },  // Top left
        { x: center.x + halfSize, y: center.y - halfSize },  // Top right
        { x: center.x + halfSize, y: center.y + halfSize },  // Bottom right
        { x: center.x - halfSize, y: center.y + halfSize }   // Bottom left
    ];
}
