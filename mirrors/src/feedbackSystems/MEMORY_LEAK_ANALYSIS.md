# Memory Leak Investigation Report

## Root Cause Analysis

I've identified **multiple critical memory leak sources** that explain the progressive lag during dragging:

## 🚨 **Primary Memory Leak Sources**

### 1. **Temporary Beam Creation Storm** (CRITICAL)
**Location**: `RealProjectionManager.updateProjection()` - Lines 107-116

**Problem**: 
- Every `mousemove` event triggers `updateAllProjections()`
- For each active real projection, a **temporary LightBeam is created** to calculate new reflection points
- These temporary beams are created with **full SVG DOM elements** including animations
- **Creation rate**: `mousemove events × active projections` per second (potentially 60+ fps × N projections)

```javascript
// This creates a FULL LightBeam with DOM elements on every update!
const tempProjection = this.lightBeamEngine.createLightBeam({
    emissionPoint: pathData.emissionPoint,
    directorVector: pathData.direction,
    maxLength: pathData.length,
    strokeColor: this.beamConfig.color,
    strokeWidth: this.beamConfig.strokeWidth,
    animated: false,           // Still creates DOM elements
    animationDuration: 0,
    mirrors: this.mirrors
});
```

**Memory Impact**: 
- Each temporary beam creates SVG polyline elements
- DOM manipulation overhead
- Memory not immediately garbage collected
- Accumulates over time causing progressive lag

### 2. **High-Frequency Event Triggering** (HIGH)
**Location**: `simpleReflectionMode.js` - Line 172

**Problem**:
```javascript
document.addEventListener('mousemove', () => {
    if (this.isSceneBeingDragged()) {
        this.virtualLightCaster.updateAllProjections(); // Called on EVERY mousemove
    }
});
```

**Issues**:
- No throttling/debouncing of mousemove events
- Can fire 60+ times per second during dragging
- Multiplied by number of active projections

### 3. **Animation State Accumulation** (MEDIUM)
**Location**: `LightBeam.animateBeamCreation()` - Lines 102-111

**Problem**:
- Animation event listeners may not be properly cleaned up
- Temporary beams still trigger animation setup even with `animated: false`
- Event listener accumulation over time

### 4. **Array Recreation on Every Update** (MEDIUM)
**Location**: Various `getAllProjections()` and `getActivePolygons()` calls

**Problem**:
- `Array.from()` calls create new arrays on every update
- Unnecessary object allocations during high-frequency updates

## 📊 **Memory Leak Progression Pattern**

```
Mouse Movement → Update Cycle → Memory Usage
     1x        →      N×      →     N×SVG_DOM_ELEMENTS
     
Where N = number of active projections
```

**Example Scenario**:
- 3 active projections
- 60 fps mouse movement
- = 180 temporary DOM elements created per second
- = 10,800 temporary elements per minute of dragging

## 🎯 **Impact Analysis**

### Performance Degradation:
1. **DOM Thrashing**: Constant SVG element creation/destruction
2. **Memory Pressure**: Temporary objects not immediately garbage collected
3. **Event Loop Blocking**: High-frequency synchronous DOM operations
4. **Browser Rendering Stress**: Constant layout recalculations

### Progressive Nature:
- **Initial**: Smooth performance with few projections
- **Degradation**: Gets worse with more active projections
- **Accumulation**: Memory pressure builds over time
- **Browser Strain**: Eventually impacts browser responsiveness

## 🔍 **Verification Strategy**

To confirm this analysis, monitor:
1. **DOM Node Count**: Check developer tools for growing SVG elements
2. **Memory Usage**: JavaScript heap size during dragging
3. **Frame Rate**: FPS drops during projection updates
4. **Call Frequency**: Count of `createLightBeam` calls per second

## 💡 **Solution Categories Identified**

1. **Eliminate Temporary Beam Creation**: Calculate geometry without creating DOM elements
2. **Throttle Update Frequency**: Implement requestAnimationFrame or debouncing
3. **Optimize Geometry Calculations**: Use pure mathematical calculations
4. **Improve Cleanup**: Ensure proper disposal of temporary objects
5. **Cache Reusable Elements**: Pool temporary objects instead of creating new ones

---

**Conclusion**: The memory leak is primarily caused by the **massive creation of temporary SVG DOM elements** during real projection updates, compounded by **high-frequency mouse events** with no throttling. This creates a perfect storm for progressive performance degradation.
