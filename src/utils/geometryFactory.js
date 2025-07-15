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

/**
 * Create pentagon vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=30] - Pentagon radius in pixels
 * @returns {Array} Array of pentagon vertices
 */
export function createPentagon({ center, size = 30 }) {
    const vertices = [];
    for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2; // Start from top
        vertices.push({
            x: center.x + size * Math.cos(angle),
            y: center.y + size * Math.sin(angle)
        });
    }
    return vertices;
}

/**
 * Create hexagon vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=28] - Hexagon radius in pixels
 * @returns {Array} Array of hexagon vertices
 */
export function createHexagon({ center, size = 28 }) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2; // Start from top
        vertices.push({
            x: center.x + size * Math.cos(angle),
            y: center.y + size * Math.sin(angle)
        });
    }
    return vertices;
}

/**
 * Create diamond (rotated square) vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=25] - Diamond radius in pixels
 * @returns {Array} Array of diamond vertices
 */
export function createDiamond({ center, size = 25 }) {
    return [
        { x: center.x, y: center.y - size },      // Top
        { x: center.x + size, y: center.y },      // Right
        { x: center.x, y: center.y + size },      // Bottom
        { x: center.x - size, y: center.y }       // Left
    ];
}

/**
 * Create star vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.outerRadius=30] - Outer star radius in pixels
 * @param {number} [config.innerRadius=12] - Inner star radius in pixels
 * @param {number} [config.points=5] - Number of star points
 * @returns {Array} Array of star vertices
 */
export function createStar({ center, outerRadius = 30, innerRadius = 12, points = 5 }) {
    const vertices = [];
    for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI / points) - Math.PI / 2; // Start from top
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        vertices.push({
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        });
    }
    return vertices;
}

/**
 * Create arrow vertices pointing right from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.length=40] - Arrow length in pixels
 * @param {number} [config.width=20] - Arrow width in pixels
 * @returns {Array} Array of arrow vertices
 */
export function createArrow({ center, length = 40, width = 20 }) {
    const halfLength = length / 2;
    const halfWidth = width / 2;
    const shaftWidth = width / 3;
    const halfShaft = shaftWidth / 2;
    
    return [
        { x: center.x + halfLength, y: center.y },                    // Tip
        { x: center.x + halfLength/3, y: center.y - halfWidth },      // Top arrow head
        { x: center.x + halfLength/3, y: center.y - halfShaft },      // Top shaft
        { x: center.x - halfLength, y: center.y - halfShaft },        // Top left
        { x: center.x - halfLength, y: center.y + halfShaft },        // Bottom left
        { x: center.x + halfLength/3, y: center.y + halfShaft },      // Bottom shaft
        { x: center.x + halfLength/3, y: center.y + halfWidth }       // Bottom arrow head
    ];
}

/**
 * Create L-shape vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=25] - L-shape size in pixels
 * @param {number} [config.thickness=8] - L-shape thickness in pixels
 * @returns {Array} Array of L-shape vertices
 */
export function createLShape({ center, size = 25, thickness = 8 }) {
    const half = size / 2;
    const thick = thickness / 2;
    
    return [
        { x: center.x - half, y: center.y - half },           // Top left
        { x: center.x - half + thickness, y: center.y - half }, // Top inner
        { x: center.x - half + thickness, y: center.y + half - thickness }, // Inner corner
        { x: center.x + half, y: center.y + half - thickness }, // Right inner
        { x: center.x + half, y: center.y + half },           // Bottom right
        { x: center.x - half, y: center.y + half }            // Bottom left
    ];
}

/**
 * Create heart shape vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=20] - Heart size in pixels
 * @returns {Array} Array of heart vertices (approximated with polygons)
 */
export function createHeart({ center, size = 20 }) {
    const s = size;
    return [
        { x: center.x, y: center.y + s },                    // Bottom point
        { x: center.x - s*0.8, y: center.y + s*0.2 },       // Bottom left curve
        { x: center.x - s*1.2, y: center.y - s*0.2 },       // Left outer curve
        { x: center.x - s*0.8, y: center.y - s*0.6 },       // Left top
        { x: center.x - s*0.3, y: center.y - s*0.6 },       // Left inner
        { x: center.x, y: center.y - s*0.2 },               // Center dip
        { x: center.x + s*0.3, y: center.y - s*0.6 },       // Right inner
        { x: center.x + s*0.8, y: center.y - s*0.6 },       // Right top
        { x: center.x + s*1.2, y: center.y - s*0.2 },       // Right outer curve
        { x: center.x + s*0.8, y: center.y + s*0.2 }        // Bottom right curve
    ];
}

/**
 * Create octagon vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.size=26] - Octagon radius in pixels
 * @returns {Array} Array of octagon vertices
 */
export function createOctagon({ center, size = 26 }) {
    const vertices = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI / 8) - Math.PI / 2; // Start from top
        vertices.push({
            x: center.x + size * Math.cos(angle),
            y: center.y + size * Math.sin(angle)
        });
    }
    return vertices;
}

/**
 * Create lightning bolt vertices from center point
 * @param {Object} config - Configuration object
 * @param {Object} config.center - Center point {x, y} with pixel values
 * @param {number} [config.height=40] - Lightning bolt height in pixels
 * @param {number} [config.width=20] - Lightning bolt width in pixels
 * @returns {Array} Array of lightning bolt vertices
 */
export function createLightning({ center, height = 40, width = 20 }) {
    const h = height / 2;
    const w = width / 2;
    
    return [
        { x: center.x - w*0.3, y: center.y - h },           // Top
        { x: center.x + w*0.8, y: center.y - h*0.2 },       // Upper right
        { x: center.x + w*0.2, y: center.y - h*0.2 },       // Upper inner
        { x: center.x + w*0.7, y: center.y + h },           // Bottom right
        { x: center.x - w*0.8, y: center.y + h*0.2 },       // Lower left
        { x: center.x - w*0.2, y: center.y + h*0.2 },       // Lower inner
    ];
}
