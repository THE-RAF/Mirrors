/**
 * @file LightBeamEngine.js - Manages light beams and ray tracing
 * Main exports: LightBeamEngine
 */

import { LightBeam } from '../basicEntities/light/LightBeam.js';
import { rayToLineIntersection, reflectVectorOverAxis } from '../math/analyticalGeometry.js';
import { distanceBetweenTwoPoints } from '../math/linearAlgebra.js';

/**
 * @class LightBeamEngine
 * Handles creation, updating, and management of light beams
 */
export class LightBeamEngine {
    /**
     * @param {Object} config
     * @param {SVGElement} config.svgCanvas - SVG element for rendering light beams
     */
    constructor({ svgCanvas }) {
        this.svgCanvas = svgCanvas;
        this.lightBeams = [];
    }

    /**
     * Calculate light beam path with reflections off mirrors
     * 
     * Ray tracing algorithm: starts from emission point, finds nearest mirror intersection,
     * reflects off mirror, and repeats until max reflections or no more intersections.
     * 
     * @param {Object} config
     * @param {Object} config.emissionPoint - Starting point {x, y}
     * @param {Object} config.directorVector - Direction vector {x, y} (normalized)
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {number} [config.maxLength=800] - Maximum ray length
     * @param {number} [config.maxReflections=10] - Maximum number of reflections
     * @returns {Array} Array of points defining the light beam path
     */
    calculateReflectionPath({ emissionPoint, directorVector, mirrors = [], maxLength = 800, maxReflections = 10 }) {
        // Find the closest mirror intersection for a ray
        function findClosestIntersection(rayStart, rayDirection, mirrors) {
            let closestIntersection = null;
            let closestDistance = Infinity;
            let closestMirror = null;
            
            for (const mirror of mirrors) {
                const intersection = rayToLineIntersection({
                    rayStart,
                    rayDirection,
                    axis: { x1: mirror.x1, y1: mirror.y1, x2: mirror.x2, y2: mirror.y2 }
                });
                
                if (intersection) {
                    const distance = distanceBetweenTwoPoints({ point1: intersection, point2: rayStart });
                    
                    // Only consider intersections closer than previous ones and far enough to avoid self-intersection
                    if (distance < closestDistance && distance > 0.1) {
                        closestDistance = distance;
                        closestIntersection = intersection;
                        closestMirror = mirror;
                    }
                }
            }
            
            return { intersection: closestIntersection, distance: closestDistance, mirror: closestMirror };
        }
        
        // Calculate final point when no more intersections are found
        function addFinalPoint(currentPoint, currentDirection, remainingLength) {
            return {
                x: currentPoint.x + currentDirection.x * remainingLength,
                y: currentPoint.y + currentDirection.y * remainingLength
            };
        }
        
        // Initialize ray tracing state
        const points = [emissionPoint];
        let currentPoint = emissionPoint;
        let currentDirection = directorVector;
        let remainingLength = maxLength;

        // Main ray tracing loop
        for (let i = 0; i < maxReflections && remainingLength > 0; i++) {
            const { intersection, distance, mirror } = findClosestIntersection(currentPoint, currentDirection, mirrors);
            
            if (intersection && distance <= remainingLength) {
                // Add intersection point and reflect
                points.push(intersection);
                currentDirection = reflectVectorOverAxis({
                    vector: currentDirection,
                    axis: { x1: mirror.x1, y1: mirror.y1, x2: mirror.x2, y2: mirror.y2 }
                });
                
                // Update ray state for next iteration
                currentPoint = intersection;
                remainingLength -= distance;
            } else {
                // No more intersections - add final point and exit
                points.push(addFinalPoint(currentPoint, currentDirection, remainingLength));
                break;
            }
        }
        
        return points;
    }

    /**
     * Update light beam reflections based on current mirror positions
     * @param {Object} config
     * @param {LightBeam} config.lightBeam - Light beam to update
     * @param {Object} config.emissionPoint - Starting point {x, y}
     * @param {Object} config.directorVector - Direction vector {x, y}
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {number} [config.maxLength=800] - Maximum ray length
     */
    updateLightBeamReflections({ lightBeam, emissionPoint, directorVector, mirrors = [], maxLength = 800 }) {
        // Normalize the director vector
        const length = Math.sqrt(directorVector.x * directorVector.x + directorVector.y * directorVector.y);
        const normalizedVector = {
            x: directorVector.x / length,
            y: directorVector.y / length
        };

        // Calculate new path
        const points = this.calculateReflectionPath({
            emissionPoint,
            directorVector: normalizedVector,
            mirrors,
            maxLength
        });

        // Update the light beam points
        lightBeam.points = points;
        lightBeam.updateBeamPath();
    }

    /**
     * Update all light beam reflections based on current mirror positions
     * @param {Object} config
     * @param {Array} config.mirrors - Array of mirror objects
     * TODO: Store light beam parameters for proper updating
     */
    updateAllLightBeamReflections({ mirrors = [] }) {
        // For now, update all light beams with hardcoded parameters
        // TODO: Store emission point and direction with each light beam for proper updating
        this.lightBeams.forEach(lightBeam => {
            this.updateLightBeamReflections({
                lightBeam,
                emissionPoint: { x: 150, y: 400 },
                directorVector: { x: 1, y: 0 },
                mirrors
            });
        });
    }

    /**
     * Update light beam paths based on current scene state
     * @param {Array} mirrors - Array of mirror objects for ray tracing
     * @param {Array} polygons - Array of polygon objects for collision detection
     * TODO: Implement ray tracing logic
     */
    updateLightBeams(mirrors = [], polygons = []) {
        // Placeholder for future ray tracing implementation
        // This will calculate intersections with mirrors and polygons
        // and update light beam paths accordingly
    }

    /**
     * Clear all existing light beams
     */
    clearLightBeams() {
        this.lightBeams.forEach(lightBeam => lightBeam.destroy());
        this.lightBeams = [];
    }

    /**
     * Clean up all light beam resources
     */
    destroy() {
        this.clearLightBeams();
    }

    /**
     * Create a light beam from emission point and direction vector
     * @param {Object} config
     * @param {Object} config.emissionPoint - Starting point {x, y}
     * @param {Object} config.directorVector - Direction vector {x, y} (will be normalized)
     * @param {Array} config.mirrors - Array of mirror objects
     * @param {string} [config.stroke='#ffff00'] - Beam color
     * @param {number} [config.strokeWidth=2] - Beam width
     * @param {number} [config.maxLength=800] - Maximum ray length
     * @returns {LightBeam} The created light beam
     */
    createLightBeam({ 
        emissionPoint, 
        directorVector, 
        mirrors = [], 
        stroke = '#ffdd00', 
        strokeWidth = 2, 
        maxLength = 800 
    }) {
        // Normalize the director vector
        const length = Math.sqrt(directorVector.x * directorVector.x + directorVector.y * directorVector.y);
        const normalizedVector = {
            x: directorVector.x / length,
            y: directorVector.y / length
        };

        // Calculate reflection path
        const points = this.calculateReflectionPath({
            emissionPoint,
            directorVector: normalizedVector,
            mirrors,
            maxLength
        });

        const lightBeam = new LightBeam({
            points,
            stroke,
            strokeWidth,
            parentSvg: this.svgCanvas
        });

        this.lightBeams.push(lightBeam);
        return lightBeam;
    }
}
