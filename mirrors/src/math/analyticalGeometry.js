/**
 * @file analyticalGeometry.js - Mathematical geometry operations
 * Main exports: reflectPointOverAxis, reflectPolygonOverAxis, lineToLineIntersection, reflectVectorOverAxis
 */

/**
 * Find intersection of ray with line segment
 * @param {Object} config
 * @param {Object} config.rayStart - Ray starting point {x, y}
 * @param {Object} config.rayDirection - Ray direction {x, y}
 * @param {Object} config.lineStart - Line start {x, y}
 * @param {Object} config.lineEnd - Line end {x, y}
 * @returns {Object|null} Intersection point {x, y} or null if no intersection
 */
export function lineToLineIntersection({ rayStart, rayDirection, lineStart, lineEnd }) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    const det = rayDirection.x * dy - rayDirection.y * dx;
    if (Math.abs(det) < 1e-10) return null; // Parallel lines
    
    const u = ((lineStart.x - rayStart.x) * dy - (lineStart.y - rayStart.y) * dx) / det;
    const v = ((lineStart.x - rayStart.x) * rayDirection.y - (lineStart.y - rayStart.y) * rayDirection.x) / det;
    
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
 * @param {Object} config.lineStart - Line start {x, y}
 * @param {Object} config.lineEnd - Line end {x, y}
 * @returns {Object} Reflected vector {x, y}
 */
export function reflectVectorOverAxis({ vector, lineStart, lineEnd }) {
    // Calculate line normal
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const normal = { x: -dy, y: dx };
    
    // Normalize normal
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= length;
    normal.y /= length;
    
    // Reflect: r = v - 2(v·n)n
    const dot = vector.x * normal.x + vector.y * normal.y;
    return {
        x: vector.x - 2 * dot * normal.x,
        y: vector.y - 2 * dot * normal.y
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
