# Mirror Reflection Sandbox – Design Document

## Overview

Interactive 2D sandbox for simulating mirror reflections with clean scene-mode architecture. Features configurable simulation modes, draggable entities, light beam projection, and virtual reflection systems.

## Architecture

### **Core System** (`src/core/`)
Foundation components used across all simulation modes:

- **`basicEntities/`** - Fundamental objects:
  - **Real**: `Polygon`, `Mirror`, `Viewer`, `LightBeam` (physical objects)
  - **Virtual**: `VirtualPolygon`, `VirtualViewer` (reflection projections)

- **`engines/`** - Physics and computation systems:
  - `ReflectionEngine` - Standard mirror reflections
  - `InfiniteReflectionEngine` - Multi-depth recursive reflections with fading
  - `LightBeamEngine` - Light ray physics and animation

- **`feedbackSystems/`** - Interactive response systems:
  - `LightBeamProjector` - Projects light beams from real and virtual polygons to the viewer

### **Configuration System** (`src/config/`)
Scene-mode separation with embedded compatibility:

- **`generalConfig.js`** - Canvas settings and current scene selection
- **`modeConfigs.js`** - Behavior definitions for `simpleReflections` and `infiniteReflections` modes
- **`scenes/`** - Individual different scene files:
  - `basicReflection.js`, `diagonalReflection.js`, `mirrorBox.js`, `triangularBox.js`, `infiniteBox.js`

### **Simulation Modes** (`src/simulationModes/`)
High-level orchestration using core components:

- **`SimpleReflectionMode`** - Basic reflections with light beam projection. Reflects everything but mirrors. Supports any degree mirror angles
- **`InfiniteReflectionMode`** - The same as SimpleReflectionMode, but with recursive reflections (mirrors reflect other mirrors)

### **Supporting Systems**
- **`math/`** - `analyticalGeometry.js`, `linearAlgebra.js` for geometric calculations
- **`utils/`** - `simpleLoader.js` (scene loading/validation), `geometryFactory.js` (shape creation)

## Features

### **Mirror Reflection Physics**
- **Standard Reflections**: Single-bounce mirror reflections with virtual object creation
- **Infinite Reflections**: Multi-depth recursive reflections with opacity fading (experimental)
- **Non-orthogonal Support**: Arbitrary mirror angles via transformation matrices

### **Interactive Entities**
- **Polygons**: Draggable geometric shapes (stars, hearts, diamonds, custom vertices)
- **Mirrors**: Draggable line segments defining reflection boundaries
- **Viewers**: Observer points for light ray tracing and projection systems

### **Light Beam System**
- **Static Beams**: Pre-defined light rays with mirror bounces and animation
- **Interactive Projection**: Click virtual objects to trace light paths (virtual→viewer direct, real→viewer with bounces)
- **Dual Visualization**: Virtual space rays (orange) and real-world paths (yellow)

### **Scene Architecture**
Each scene defines: `objects[]`, `mirrors[]`, `viewers[]`, `lightBeams[]`, and embedded `mode` compatibility.

## Technical Stack

- **JavaScript ES6 Modules** - Clean import/export architecture
- **SVG Rendering** - Multi-layer system (background→middle→foreground)
- **Mathematical Foundation** - Linear algebra and analytical geometry utilities

## Usage Patterns

1. **Scene Selection**: Modify `generalConfig.currentExample`
2. **Mode Behavior**: Configure interaction and reflection settings in `modeConfigs`
3. **Custom Scenes**: Add new scene files with embedded mode compatibility
4. **Entity Interaction**: Drag objects to update reflections and light beams in real-time
