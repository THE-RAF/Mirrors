/**
 * @file linearAlgebra.js - Basic linear algebra operations for 2D vectors
 * Main exports: normalizeVector, vectorLength, dotProduct
 */

/**
 * Normalize a vector to unit length
 * @param {Object} config
 * @param {Object} config.vector - Vector to normalize {x, y}
 * @returns {Object} Normalized vector {x, y}
 */
export function normalizeVector({ vector }) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (length === 0) return { x: 0, y: 0 };
    return {
        x: vector.x / length,
        y: vector.y / length
    };
}

/**
 * Calculate the length of a vector
 * @param {Object} config
 * @param {Object} config.vector - Vector to measure {x, y}
 * @returns {number} Vector length
 */
export function vectorLength({ vector }) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

/**
 * Calculate dot product of two vectors
 * @param {Object} config
 * @param {Object} config.v1 - First vector {x, y}
 * @param {Object} config.v2 - Second vector {x, y}
 * @returns {number} Dot product
 */
export function dotProduct({ v1, v2 }) {
    return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Calculate the distance between two points
 * @param {Object} config
 * @param {Object} config.point1 - First point {x, y}
 * @param {Object} config.point2 - Second point {x, y}
 * @returns {number} Distance between the two points
 */
export function distanceBetweenTwoPoints({ point1, point2 }) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
