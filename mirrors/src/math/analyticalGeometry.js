/**
 * @file analyticalGeometry.js - Mathematical geometry operations
 * Main exports: reflectPointOverAxis, reflectPolygonOverAxis, rayToLineIntersection, reflectVectorOverAxis
 */

import { normalizeVector, vectorLength, dotProduct } from './linearAlgebra.js';

/**
 * Find intersection of ray with line segment
 * @param {Object} config
 * @param {Object} config.rayStart - Ray starting point {x, y}
 * @param {Object} config.rayDirection - Ray direction {x, y}
 * @param {Object} config.axis - Line segment to intersect with {x1, y1, x2, y2}
 * @returns {Object|null} Intersection point {x, y} or null if no intersection
 */
export function rayToLineIntersection({ rayStart, rayDirection, axis }) {
    const { x1, y1, x2, y2 } = axis;
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    const det = rayDirection.x * dy - rayDirection.y * dx;
    if (Math.abs(det) < 1e-10) return null; // Parallel lines
    
    const u = ((x1 - rayStart.x) * dy - (y1 - rayStart.y) * dx) / det;
    const v = ((x1 - rayStart.x) * rayDirection.y - (y1 - rayStart.y) * rayDirection.x) / det;
    
    if (u >= 0 && v >= 0 && v <= 1) {
        return {
            x: rayStart.x + u * rayDirection.x,
            y: rayStart.y + u * rayDirection.y
        };
    }
    
    return null;
}

/**
 * Reflect vector across a line
 * @param {Object} config
 * @param {Object} config.vector - Vector to reflect {x, y}
 * @param {Object} config.axis - Line segment to reflect over {x1, y1, x2, y2}
 * @returns {Object} Reflected vector {x, y}
 */
export function reflectVectorOverAxis({ vector, axis }) {
    const { x1, y1, x2, y2 } = axis;
    // Calculate line direction vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const normal = { x: -dy, y: dx };
    
    // Normalize normal
    const normalizedNormal = normalizeVector({ vector: normal });
    
    // Reflect: r = v - 2(v·n)n
    const dot = dotProduct({ v1: vector, v2: normalizedNormal });
    return {
        x: vector.x - 2 * dot * normalizedNormal.x,
        y: vector.y - 2 * dot * normalizedNormal.y
    };
}

/**
 * Reflect a point over a line segment (axis)
 * @param {Object} config
 * @param {Object} config.point - Point to reflect {x, y}
 * @param {Object} config.axis - Line segment to reflect over {x1, y1, x2, y2}
 * @returns {Object} Reflected point coordinates {x, y}
 */
export function reflectPointOverAxis({ point, axis }) {
    const { x: px, y: py } = point;
    const { x1, y1, x2, y2 } = axis;
    
    // Calculate line direction vector
    const lineDirection = { x: x2 - x1, y: y2 - y1 };
    
    // Handle degenerate case (zero-length line)
    const lineLength = vectorLength({ vector: lineDirection });
    if (lineLength === 0) {
        return { x: px, y: py }; // Return original point
    }
    
    // Vector from line start to point
    const pointVector = { x: px - x1, y: py - y1 };
    
    // Project point onto line (parametric t value)
    const t = dotProduct({ v1: pointVector, v2: lineDirection }) / (lineLength * lineLength);
    
    // Find closest point on line
    const closestX = x1 + t * lineDirection.x;
    const closestY = y1 + t * lineDirection.y;
    
    // Reflect point across the line
    const reflectedX = 2 * closestX - px;
    const reflectedY = 2 * closestY - py;
    
    return {
        x: reflectedX,
        y: reflectedY
    };
}

/**
 * Reflect a polygon over a line segment (axis)
 * @param {Object} config
 * @param {Array} config.polygon - Array of polygon vertices [{x, y}, ...]
 * @param {Object} config.axis - Line segment to reflect over {x1, y1, x2, y2}
 * @returns {Array} Array of reflected polygon vertices [{x, y}, ...]
 */
export function reflectPolygonOverAxis({ polygon, axis }) {
    return polygon.map(vertex => 
        reflectPointOverAxis({ 
            point: vertex, 
            axis: axis 
        })
    );
}
