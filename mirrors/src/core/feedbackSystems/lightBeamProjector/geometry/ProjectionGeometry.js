/**
 * @file ProjectionGeometry.js - Pure functions for projection geometry calculations
 * Handles all mathematical computations for light beam projections
 */

import { calculatePolygonCenter } from '../../../../math/analyticalGeometry.js';
import { normalizeVector, vectorLength } from '../../../../math/linearAlgebra.js';

/**
 * Calculate the virtual projection path from polygon to viewer
 * @param {Object} config
 * @param {Object} config.virtualPolygon - The virtual polygon
 * @param {Object} config.viewer - The viewer object with x, y coordinates
 * @returns {Object} Projection path data
 */
export function calculateVirtualProjectionPath({ virtualPolygon, viewer }) {
    const emissionPoint = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
    
    const direction = { 
        x: viewer.x - emissionPoint.x, 
        y: viewer.y - emissionPoint.y 
    };
    
    const normalizedDirection = normalizeVector({ vector: direction });
    const length = vectorLength({ vector: direction });
    
    return {
        emissionPoint,
        direction: normalizedDirection,
        length,
        endpoint: viewer
    };
}

/**
 * Calculate the real projection path from real polygon through mirrors to viewer
 * @param {Object} config
 * @param {Object} config.virtualPolygon - The virtual polygon (contains sourcePolygon reference)
 * @param {Object} config.viewer - The viewer object
 * @param {Object} config.lightBeamEngine - Engine for calculating reflections
 * @param {Array} config.mirrors - Array of mirror objects
 * @returns {Object|null} Real projection path data or null if invalid
 */
export function calculateRealProjectionPath({ virtualPolygon, viewer, lightBeamEngine, mirrors }) {
    if (!lightBeamEngine) return null;
    
    const virtualCenter = calculatePolygonCenter({ vertices: virtualPolygon.vertices });
    const realCenter = calculatePolygonCenter({ vertices: virtualPolygon.sourcePolygon.vertices });
    
    // Calculate reverse path (viewer to virtual polygon) to find reflection direction
    const reverseDirection = { 
        x: virtualCenter.x - viewer.x, 
        y: virtualCenter.y - viewer.y 
    };
    const normalizedReverseDirection = normalizeVector({ vector: reverseDirection });
    const projectionLength = vectorLength({ vector: reverseDirection });
    
    // Use pure geometry calculation
    const reflectionPoints = lightBeamEngine.calculateReflectionPath({
        emissionPoint: { x: viewer.x, y: viewer.y },
        directorVector: normalizedReverseDirection,
        mirrors,
        maxLength: projectionLength
    });
    
    if (reflectionPoints && reflectionPoints.length >= 2) {
        const lastPoint = reflectionPoints[reflectionPoints.length - 1];
        const secondLastPoint = reflectionPoints[reflectionPoints.length - 2];
        
        const segmentDirection = {
            x: lastPoint.x - secondLastPoint.x,
            y: lastPoint.y - secondLastPoint.y
        };
        
        // Invert direction for real projection (real polygon → viewer)
        const realDirection = normalizeVector({ 
            vector: { x: -segmentDirection.x, y: -segmentDirection.y }
        });
        
        return {
            emissionPoint: realCenter,
            direction: realDirection,
            length: projectionLength,
            reflectionPath: [...reflectionPoints]
        };
    }
    
    return null;
}

/**
 * Validate if a real projection endpoint reaches the viewer within tolerance
 * @param {Object} config
 * @param {Object} config.projectionPath - The calculated projection path
 * @param {Object} config.viewer - The viewer object
 * @param {Object} config.lightBeamEngine - Engine for beam calculations
 * @param {Array} config.mirrors - Array of mirror objects
 * @param {number} config.tolerance - Distance tolerance for validation
 * @returns {boolean} True if projection is valid
 */
export function validateProjectionEndpoint({ projectionPath, viewer, lightBeamEngine, mirrors, tolerance = 10 }) {
    if (!projectionPath || !lightBeamEngine) return false;
    
    // Use pure geometry calculation (NO DOM CREATION!)
    const reflectionPoints = lightBeamEngine.calculateReflectionPath({
        emissionPoint: projectionPath.emissionPoint,
        directorVector: projectionPath.direction,
        mirrors,
        maxLength: projectionPath.length
    });
    
    if (reflectionPoints && reflectionPoints.length > 0) {
        const endpoint = reflectionPoints[reflectionPoints.length - 1];
        const distance = Math.sqrt(
            Math.pow(endpoint.x - viewer.x, 2) + 
            Math.pow(endpoint.y - viewer.y, 2)
        );
        return distance < tolerance;
    }
    
    return false;
}
