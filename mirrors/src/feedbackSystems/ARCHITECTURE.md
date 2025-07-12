/**
 * @file ARCHITECTURE.md - Architectural documentation for the modular LightBeamProjector system
 */

# LightBeamProjector Architecture Documentation

## Overview

The LightBeamProjector has been refactored from a monolithic class into a modular, extensible system that follows SOLID principles and separation of concerns. This document details the architectural decisions, patterns, and benefits of the new design.

## Architectural Principles

### 1. Separation of Concerns
- **Geometry calculations** are isolated into pure functions
- **Virtual projections** are managed by a dedicated manager
- **Real projections** are managed by a separate manager
- **Coordination logic** is handled by the main projector class

### 2. Single Responsibility Principle
Each module has a single, well-defined responsibility:
- `ProjectionGeometry`: Mathematical calculations only
- `VirtualProjectionManager`: Virtual beam lifecycle management
- `RealProjectionManager`: Real beam lifecycle management
- `ModularLightBeamProjector`: Coordination and public API

### 3. Open/Closed Principle
The system is open for extension but closed for modification:
- New projection types can be added without changing existing code
- New calculation methods can be added to geometry module
- Event system allows external extensions

### 4. Dependency Inversion
High-level modules don't depend on low-level modules:
- Managers depend on abstractions (beam interfaces)
- Projector depends on manager interfaces
- Pure functions have no dependencies

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ModularLightBeamProjector                    │
│                    (Coordination Layer)                         │
├─────────────────────────────────────────────────────────────────┤
│  • Public API                                                   │
│  • Event coordination                                           │
│  • Validation orchestration                                     │
│  • Manager coordination                                         │
└─────────────────┬───────────────────────┬─────────────────────────┘
                  │                       │
        ┌─────────▼──────────┐   ┌────────▼──────────┐
        │ VirtualProjection  │   │  RealProjection   │
        │     Manager        │   │     Manager       │
        │                    │   │                   │
        │ • Lifecycle mgmt   │   │ • Lifecycle mgmt  │
        │ • State tracking   │   │ • State tracking  │
        │ • Virtual beams    │   │ • Real beams      │
        └─────────┬──────────┘   └────────┬──────────┘
                  │                       │
                  │       ┌───────────────▼──────────────┐
                  │       │     ProjectionGeometry       │
                  │       │     (Pure Functions)         │
                  │       │                              │
                  │       │ • Path calculations          │
                  │       │ • Validation logic           │
                  │       │ • Update computations        │
                  │       │ • No side effects            │
                  │       └──────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │   VirtualLightBeam │
        │   (Entity)         │
        │                    │
        │ • Rendering        │
        │ • Animation        │
        │ • SVG management   │
        └────────────────────┘
```

## Module Descriptions

### ProjectionGeometry.js
**Purpose**: Pure mathematical functions for projection calculations
**Responsibilities**:
- Calculate virtual projection paths
- Calculate real projection paths through mirrors
- Validate projection endpoints
- Update calculations for scene changes

**Key Functions**:
```javascript
calculateVirtualProjectionPath(virtualPolygon, viewer)
calculateRealProjectionPath(virtualPolygon, viewer, lightBeamEngine, mirrors)
validateProjectionEndpoint(projectionPath, viewer, lightBeamEngine, mirrors, tolerance)
updateProjectionPaths(virtualPolygon, viewer, lightBeamEngine, mirrors)
```

**Benefits**:
- Testable in isolation
- No side effects
- Reusable across different contexts
- Easy to optimize and cache

### VirtualProjectionManager.js
**Purpose**: Manage virtual light beam projections with per-polygon state
**Responsibilities**:
- Create virtual projections
- Track projections by polygon
- Update projections during scene changes
- Handle projection lifecycle

**Key Features**:
- Map-based state tracking (`virtualPolygon -> projection`)
- Toggle functionality
- Batch updates
- Memory management

### RealProjectionManager.js
**Purpose**: Manage real light beam projections through mirrors
**Responsibilities**:
- Create real projections with mirror reflections
- Handle complex reflection calculations
- Manage beam engine interactions
- Coordinate with mirror system

**Key Features**:
- Reflection path calculation
- Temporary beam creation for updates
- Invalid projection cleanup
- Mirror system integration

### ModularLightBeamProjector.js
**Purpose**: Main coordinator providing public API and orchestration
**Responsibilities**:
- Coordinate between managers
- Provide unified public interface
- Handle validation logic
- Manage event system
- Maintain backward compatibility

**Key Features**:
- Event-driven architecture
- Manager delegation
- Validation orchestration
- Statistics and monitoring

## State Management

### Before (Monolithic)
```javascript
class LightBeamProjector {
    // Global state
    virtualProjections = []      // All virtual projections
    realProjections = []         // All real projections
    lastClickedVirtualPolygon    // Single polygon tracking
}
```

### After (Modular)
```javascript
class VirtualProjectionManager {
    projectionsByPolygon = new Map()  // Per-polygon tracking
}

class RealProjectionManager {
    projectionsByPolygon = new Map()  // Per-polygon tracking
}
```

**Benefits**:
- No global state conflicts
- Individual polygon management
- Better memory efficiency
- Easier debugging and testing

## Event System

The modular system includes an optional event system for external integration:

```javascript
projector.setEventHandler('onProjectionCreated', ({ virtualPolygon }) => {
    console.log('Projection created for:', virtualPolygon);
    updateUI();
});

projector.setEventHandler('onProjectionRemoved', ({ virtualPolygon }) => {
    console.log('Projection removed for:', virtualPolygon);
    updateStatistics();
});

projector.setEventHandler('onProjectionUpdated', ({ virtualPolygon }) => {
    console.log('Projection updated for:', virtualPolygon);
    validateScene();
});
```

## Toggle Functionality

### Implementation
The toggle functionality is implemented through manager-level state tracking:

1. **Check Current State**: Each manager tracks projections per polygon
2. **Toggle Logic**: If exists, remove; if doesn't exist, create
3. **Coordination**: Both managers toggle independently
4. **Validation**: Only create if projection is valid

### Benefits
- Individual polygon control
- No interference between polygons
- Intuitive user interaction
- Predictable behavior

## Extension Points

### Adding New Projection Types
```javascript
// 1. Create new manager
class CurvedProjectionManager {
    constructor({ svgCanvas, beamConfig }) {
        this.projectionsByPolygon = new Map();
        // ... implementation
    }
}

// 2. Add to main projector
class ExtendedProjector extends ModularLightBeamProjector {
    constructor(config) {
        super(config);
        this.curvedManager = new CurvedProjectionManager(config);
    }
}
```

### Adding New Calculation Methods
```javascript
// Add to ProjectionGeometry.js
export function calculateCurvedProjectionPath(polygon, viewer, curvature) {
    // Implementation
}

export function calculateMultiViewerProjection(polygon, viewers) {
    // Implementation
}
```

### Custom Event Handlers
```javascript
// External systems can integrate via events
projector.setEventHandler('onProjectionCreated', (data) => {
    // Update external analytics
    // Trigger other systems
    // Log events
});
```

## Performance Considerations

### Optimization Strategies

1. **Calculation Caching**: Pure functions enable easy caching
2. **Selective Updates**: Only affected projections are updated
3. **Lazy Evaluation**: Projections created only when needed
4. **Memory Management**: Proper cleanup prevents memory leaks

### Performance Metrics

- **Creation Time**: Reduced due to specialized managers
- **Update Time**: Improved through selective updates
- **Memory Usage**: Optimized through proper state management
- **Scalability**: Better handling of multiple projections

## Testing Strategy

### Unit Testing
```javascript
// Test pure functions independently
describe('ProjectionGeometry', () => {
    test('calculateVirtualProjectionPath', () => {
        const result = calculateVirtualProjectionPath(polygon, viewer);
        expect(result.length).toBeGreaterThan(0);
    });
});

// Test managers in isolation
describe('VirtualProjectionManager', () => {
    test('createProjection', () => {
        const manager = new VirtualProjectionManager(config);
        const projection = manager.createProjection(polygon, viewer);
        expect(projection).toBeDefined();
    });
});
```

### Integration Testing
```javascript
// Test full system behavior
describe('ModularLightBeamProjector', () => {
    test('toggle functionality', () => {
        const projector = new ModularLightBeamProjector(config);
        
        // First click creates
        projector.handleVirtualPolygonClick({ virtualPolygon });
        expect(projector.hasProjections(virtualPolygon)).toBe(true);
        
        // Second click removes
        projector.handleVirtualPolygonClick({ virtualPolygon });
        expect(projector.hasProjections(virtualPolygon)).toBe(false);
    });
});
```

## Migration Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Pure functions and isolated components
3. **Extensibility**: Easy to add new features
4. **Performance**: Optimized state management
5. **Debugging**: Easier to locate and fix issues
6. **Documentation**: Self-documenting architecture

## Future Enhancements

### Planned Improvements
1. **Animation Control**: Per-projection animation settings
2. **Rendering Options**: Different visual styles
3. **Physics Integration**: Advanced reflection calculations
4. **Multi-Viewer Support**: Support for multiple viewers
5. **Persistence**: Save/load projection states

### Extension Possibilities
1. **Real-time Collaboration**: Shared projection states
2. **Analytics Integration**: Projection usage metrics
3. **Performance Monitoring**: Runtime performance tracking
4. **Custom Shaders**: Advanced rendering effects
5. **AI Integration**: Smart projection suggestions

This modular architecture provides a solid foundation for current needs while enabling future growth and enhancements.
