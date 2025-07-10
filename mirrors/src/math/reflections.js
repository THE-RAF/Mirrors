/**
 * @file reflections.js - Mathematical reflection operations
 * Main exports: reflectPointOverAxis, reflectPolygonOverAxis
 */

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
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Handle degenerate case (zero-length line)
    if (dx === 0 && dy === 0) {
        return { x: px, y: py }; // Return original point
    }
    
    // Calculate line length squared
    const lengthSquared = dx * dx + dy * dy;
    
    // Vector from line start to point
    const pointVectorX = px - x1;
    const pointVectorY = py - y1;
    
    // Project point onto line (parametric t value)
    const t = (pointVectorX * dx + pointVectorY * dy) / lengthSquared;
    
    // Find closest point on line
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    
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
