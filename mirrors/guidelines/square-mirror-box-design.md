# Square Mirror Box Mode Design

## Overview
A specialized mode for square mirror boxes that uses symmetry-based tiling instead of ray-based reflections.

## Core Concept
- **Central Real Box**: One physical mirror box containing real objects
- **Virtual Tiled Boxes**: Infinite grid of virtual boxes created by flipping horizontally and vertically
- **No Reflection Engines**: Uses geometric transformation instead of ray-tracing

## Algorithm
1. Create one real square mirror box at canvas center
2. Fill interior with real objects and mirrors
3. Create virtual boxes by flipping:
   - Horizontally: mirror content left-right
   - Vertically: mirror content up-down
   - Both: mirror content diagonally
4. Tile entire canvas with alternating flipped versions

## Architecture

### New Components
- **`SquareMirrorBoxMode`** - Main simulation mode
- **`TilingEngine`** - Handles virtual box creation and updates
- **`VirtualBox`** - Represents one tiled box instance

### Key Principles (Following Guidelines)
- **Simple & Focused**: Each class has single responsibility
- **Minimal Code**: No complex reflection calculations
- **Easy to Understand**: Geometric flipping is intuitive
- **Small Files**: Separate concerns across focused modules

### Configuration
```javascript
'squareMirrorBox': {
    interaction: {
        draggableObjects: true  // Only objects inside box
    },
    tiling: {
        enabled: true,
        boxSize: 200,          // Square box dimensions
        tilesPerDirection: 4   // How many tiles to create
    }
}
```

## Benefits
- **Performance**: No complex ray calculations
- **Predictable**: Symmetry-based approach is deterministic
- **Visual Clarity**: Perfect infinite mirror effect
- **Simple Implementation**: Basic coordinate transformations

## Implementation Strategy
1. Create mode placeholder with basic structure
2. Implement simple square box rendering
3. Add geometric tiling logic
4. Add object interaction within box constraints
