/**
 * @file MIGRATION_GUIDE.md - Guide for migrating to the modular LightBeamProjector system
 */

# LightBeamProjector Migration Guide

## Overview

The LightBeamProjector has been refactored into a modular, extensible architecture that separates concerns and improves maintainability. This guide explains the changes and how to migrate.

## New Architecture

### Components

1. **ModularLightBeamProjector** - Main coordinator class
2. **VirtualProjectionManager** - Manages virtual projections
3. **RealProjectionManager** - Manages real projections  
4. **ProjectionGeometry** - Pure functions for calculations

### Key Benefits

- **Separation of Concerns**: Virtual and real projections managed separately
- **Pure Functions**: Geometry calculations are isolated and testable
- **Toggle Support**: Individual polygon projections can be toggled on/off
- **Event System**: Optional event handlers for projection lifecycle
- **Extensibility**: Easy to add new projection types or behaviors

## Migration Steps

### 1. Import Changes

**Before:**
```javascript
import { LightBeamProjector } from './src/feedbackSystems/LightBeamProjector.js';
```

**After:**
```javascript
import { ModularLightBeamProjector } from './src/feedbackSystems/ModularLightBeamProjector.js';
```

### 2. Constructor (No Changes Required)

The constructor interface remains the same:

```javascript
const projector = new ModularLightBeamProjector({
    svgCanvas,
    viewer,
    lightBeamEngine,
    mirrors,
    beamConfig
});
```

### 3. Method Changes

#### Click Handling (No Changes)
```javascript
// Still works the same
projector.handleVirtualPolygonClick({ virtualPolygon });
```

#### Update Method (Renamed)
**Before:**
```javascript
projector.updateBeams();
```

**After:**
```javascript
projector.updateAllProjections();
```

#### Clear Method (Renamed)
**Before:**
```javascript
projector.clearAllBeams();
```

**After:**
```javascript
projector.clearAllProjections();
```

### 4. New Features Available

#### Individual Polygon Management
```javascript
// Create projections for specific polygon
projector.createProjections({ virtualPolygon });

// Remove projections for specific polygon
projector.removeProjections({ virtualPolygon });

// Check if polygon has projections
const hasProjections = projector.hasProjections({ virtualPolygon });
```

#### Statistics and Monitoring
```javascript
const stats = projector.getProjectionStats();
console.log(`Active projections: ${stats.totalProjections}`);
console.log(`Virtual: ${stats.virtualCount}, Real: ${stats.realCount}`);
```

#### Event Handling
```javascript
projector.setEventHandler({ 
    eventName: 'onProjectionCreated', 
    handler: ({ virtualPolygon }) => {
        console.log('Projection created for polygon:', virtualPolygon);
    }
});

projector.setEventHandler({ 
    eventName: 'onProjectionRemoved', 
    handler: ({ virtualPolygon }) => {
        console.log('Projection removed for polygon:', virtualPolygon);
    }
});
```

#### Direct Manager Access
```javascript
// Advanced use cases
const virtualManager = projector.getVirtualManager();
const realManager = projector.getRealManager();
```

## Behavior Changes

### Toggle Functionality

**Before:** Clicking a polygon would clear all projections and create new ones
**After:** Clicking a polygon toggles projections only for that polygon

### State Management

**Before:** Global state with `lastClickedVirtualPolygon`
**After:** Per-polygon state tracking with Maps

### Validation

**Before:** Validation logic mixed with creation logic
**After:** Pure validation functions in ProjectionGeometry

## Testing Considerations

### Unit Testing

The new architecture enables better unit testing:

```javascript
// Test geometry calculations independently
import { calculateVirtualProjectionPath } from './geometry/ProjectionGeometry.js';

// Test managers in isolation
const virtualManager = new VirtualProjectionManager({ svgCanvas, beamConfig });

// Test coordination logic
const projector = new ModularLightBeamProjector(config);
```

### Integration Testing

```javascript
// Test full workflow
const projector = new ModularLightBeamProjector(config);
projector.handleVirtualPolygonClick({ virtualPolygon });
expect(projector.hasProjections({ virtualPolygon })).toBe(true);

// Test toggle behavior
projector.handleVirtualPolygonClick({ virtualPolygon });
expect(projector.hasProjections({ virtualPolygon })).toBe(false);
```

## Backwards Compatibility

A compatibility wrapper is available in `LightBeamProjector.js` that delegates to the new modular system while maintaining the original API.

## Performance Considerations

- **Improved**: Calculations are now cached and reused
- **Improved**: Only affected projections are updated during scene changes
- **Improved**: Reduced object creation through better state management

## Future Extensibility

The new architecture makes it easy to:

1. Add new projection types (e.g., curved projections)
2. Implement different rendering strategies
3. Add animation controls per projection
4. Integrate with external physics engines
5. Support multiple viewers or projection targets

## Troubleshooting

### Common Issues

1. **Import Errors**: Update import paths for new module structure
2. **Method Names**: Update `updateBeams()` to `updateAllProjections()`
3. **Event Handlers**: Set up event handlers if you need projection lifecycle notifications

### Debug Helpers

```javascript
// Get current state
console.log(projector.getProjectionStats());

// Access individual managers for debugging
const virtualManager = projector.getVirtualManager();
console.log('Virtual projections:', virtualManager.getAllProjections());
```
