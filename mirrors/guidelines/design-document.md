# Mirror Reflection Sandbox – Design Document

## Overview

Interactive 2D sandbox for simulating mirror reflections with clean, modular architecture. Features recursive reflections, draggable entities, interactive light beam projection, and virtual reflection systems using SVG rendering and ES6 modules.

## Features

### **Mirror Reflection Physics**
- **Recursive Reflections**: Multi-depth mirror reflections with configurable depth
- **Virtual Object Creation**: Virtual mirrors, polygons, and viewers created automatically
- **Tree-based Processing**: Modular layer-by-layer reflection calculation using tree structures
- **Dynamic Updates**: Real-time reflection updates during dragging

### **Interactive Entities**
- **Polygons**: Draggable geometric shapes with custom vertices and colors
- **Mirrors**: Draggable line segments defining reflection boundaries
- **Viewers**: Observer points for light ray projection systems
- **Virtual Objects**: Automatically generated reflections of real objects

### **Light Beam System**
- **Static Light Beams**: Pre-configured light rays with automatic mirror bouncing
- **Interactive Projection**: Click virtual objects to trace light paths from real and virtual polygons to viewer
- **Dual Projection Types**: 
  - Virtual beams (orange) - direct virtual object to viewer
  - Real beams (yellow) - real object to viewer with mirror reflections
- **Dynamic Animation**: Smooth beam animations with configurable duration and styling

## Architecture

### **Core System** (`src/core/`)
Foundation components for the simulation:

- **`basicEntities/`** - Fundamental objects:
  - **Real**: `Polygon`, `Mirror`, `Viewer`, `LightBeam` (physical objects)
  - **Virtual**: `VirtualPolygon`, `VirtualViewer`, `VirtualMirror`, `VirtualLightBeam` (reflections)

- **`engines/`** - Physics and computation systems:
  - `ReflectionEngine` - Manages recursive mirror reflections with configurable depth
  - `LightBeamEngine` - Light ray physics, animation, and mirror bouncing

- **`feedbackSystems/`** - Interactive response systems:
  - `LightBeamProjector` - Interactive light beam projection from virtual polygons to viewer
    - `VirtualProjectionManager` - Handles virtual polygon projections
    - `RealProjectionManager` - Handles real polygon projections through mirrors
    - `ProjectionGeometry` - Geometric calculations for projections

### **Configuration System** (`src/config/`)
Clean scene-based architecture:

- **`generalConfig.js`** - Canvas settings and current scene selection
- **`modeConfig.js`** - Single mode configuration for `generalReflections`
- **`scenes/`** - Individual scene files:
  - `basicReflection.js`, `diagonalReflection.js`, `mirrorBox.js`, `triangularBox.js`

### **Simulation Mode** (`src/simulationModes/`)
Single unified simulation engine:

- **`GeneralReflectionMode`** - Complete reflection simulation with recursive reflections, light beam projection, and interactive features

### **Supporting Systems**
- **`math/`** - `analyticalGeometry.js`, `linearAlgebra.js` for geometric calculations
- **`utils/`** - `simpleLoader.js` (scene loading), `geometryFactory.js` (shape creation helpers)

### **Scene Architecture**
Each scene defines: `objects[]`, `mirrors[]`, `viewers[]`, `lightBeams[]`, and embedded `mode` compatibility (all use `generalReflections`, but the system can be extended into toggling different modes).

## Technical Stack

- **JavaScript ES6 Modules** - Clean import/export architecture with modular design
- **SVG Rendering** - Three-layer system (background→middle→foreground) for proper z-ordering
- **Vite Development** - Modern build tool for fast development and optimized builds
- **Mathematical Foundation** - Linear algebra and analytical geometry utilities

## Usage Patterns

1. **Scene Selection**: Modify `generalConfig.currentExample` to choose from available scenes
2. **Interactive Elements**: Drag polygons, mirrors, and viewers to see real-time reflection updates  
3. **Light Beam Projection**: Click virtual polygons to project light beams to the viewer
4. **Examples**: Modify existing examples or create entire new scenes with `config/scenes`
4. **Configuration**: Adjust recursive reflection depth and beam styling in `modeConfig.js`

## Project Structure

- **Entry Point**: `main.js` - Sets up canvas and initializes simulation
- **Scene Loading**: `simpleLoader.js` - Loads scenes and creates simulation instances
- **Unified Mode**: Single `GeneralReflectionMode` handles all reflection scenarios
- **Modular Systems**: Clean separation between entities, engines, and feedback systems
