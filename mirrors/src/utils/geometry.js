/**
 * @file geometry.js - Simple geometry helper functions
 */

/**
 * Create triangle vertices from center point
 * @param {Object} center - Center point {x, y} with percentage strings
 * @param {number} size - Triangle size
 * @returns {Array} Array of triangle vertices
 */
export function createTriangle(center, size = 3) {
    return [
        { x: center.x, y: `${parseFloat(center.y) - size/2}%` },  // Top vertex
        { x: `${parseFloat(center.x) - size/2}%`, y: `${parseFloat(center.y) + size/2}%` },  // Bottom left
        { x: `${parseFloat(center.x) + size/2}%`, y: `${parseFloat(center.y) + size/2}%` }   // Bottom right
    ];
}

/**
 * Create square vertices from center point
 * @param {Object} center - Center point {x, y} with percentage strings
 * @param {number} size - Square size
 * @returns {Array} Array of square vertices
 */
export function createSquare(center, size = 4) {
    const halfSize = size / 3;
    return [
        { x: `${parseFloat(center.x) - halfSize}%`, y: `${parseFloat(center.y) - halfSize}%` },  // Top left
        { x: `${parseFloat(center.x) + halfSize}%`, y: `${parseFloat(center.y) - halfSize}%` },  // Top right
        { x: `${parseFloat(center.x) + halfSize}%`, y: `${parseFloat(center.y) + halfSize}%` },  // Bottom right
        { x: `${parseFloat(center.x) - halfSize}%`, y: `${parseFloat(center.y) + halfSize}%` }   // Bottom left
    ];
}
