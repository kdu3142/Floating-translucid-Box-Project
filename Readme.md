# Interactive 3D Floating Box with Dynamic Background
## Technical Documentation & Configuration Guide

## Overview
This project implements an interactive 3D floating box with dynamic background animations using vanilla JavaScript and CSS. The system consists of two main components: a floating box with sophisticated 3D transformations and a background animation system with floating bubbles. The project utilizes modern web technologies including CSS transforms, 3D perspectives, and requestAnimationFrame for smooth animations.

## Core Components

### 1. Floating Box System
The floating box system creates an interactive 3D element with the following features:
- Real-time mouse tracking
- Perspective-based 3D rotation
- Dynamic shadow projection
- Interactive glow effects
- Smooth motion interpolation
- Glass morphism effects

### 2. Background Animation System
The background consists of:
- Dynamically generated floating bubbles
- Automatic bubble regeneration
- Randomized movement patterns
- Color variety and opacity management
- Diagonal and vertical movement options

## Configuration

### CONFIG Object Structure
```javascript
const CONFIG = {
    box: {
        rotationMax: 15,        // Maximum rotation angle in degrees
        hoverHeight: 30,        // Z-axis translation on hover
        motionSpeed: 0.15,      // Animation interpolation factor (0-1)
        blur: '20px',          // Backdrop filter blur amount
        saturation: '180%',    // Backdrop filter saturation
        borderRadius: '30px',  // Box corner radius
        glowOpacity: 0.2,      // Maximum opacity of glow effect
        glowBlur: '20px'       // Glow effect blur radius
    },
    shadow: {
        scale: 0.005,          // Shadow scale reduction per pixel of z-translation
        offset: 1.2,           // Shadow movement multiplier
        blur: '15px',          // Shadow blur radius
        opacity: 0.4,          // Base shadow opacity
        distance: 50           // Distance from box bottom (px)
    },
    bubbles: {
        count: 30,             // Number of simultaneous bubbles
        minSize: 30,           // Minimum bubble diameter (px)
        maxSize: 110,          // Maximum bubble diameter (px)
        colors: [              // Available bubble colors
            '#ff6b6b', 
            '#9340ff', 
            '#4dabf7', 
            '#37b24d', 
            '#f06595'
        ],
        speeds: {
            min: 15,           // Minimum animation duration (s)
            max: 25            // Maximum animation duration (s)
        },
        opacity: 0.7          // Bubble opacity
    }
}
```

### Configuration Impact Analysis

#### Box Configuration
- `rotationMax`: Controls the maximum rotation angle of the box in response to mouse movement. Higher values create more dramatic tilt effects but may cause visual instability.
- `hoverHeight`: Determines how far the box "lifts" on the Z-axis during hover. Larger values create a more pronounced floating effect but require careful shadow adjustment.
- `motionSpeed`: Affects the smoothness of all box animations. Lower values (0.01-0.1) create smoother but slower transitions, while higher values (0.2-1.0) create more immediate responses.
- `blur` & `saturation`: Control the glass morphism effect intensity. Higher blur values increase the frosted glass effect but may impact performance.

#### Shadow Configuration
- `scale`: Controls how much the shadow shrinks as the box "lifts". Lower values maintain shadow size, higher values create more dramatic lifting effects.
- `offset`: Determines how far the shadow moves in response to box rotation. Higher values create more exaggerated shadow movement.
- `distance`: Vertical distance between box and shadow. Affects the perceived height of the floating effect.

#### Bubble Configuration
- `count`: Number of simultaneous bubbles. Higher values create denser animations but impact performance.
- `size` range: Affects visual variety. Larger ranges create more dynamic scenes but may affect visual coherence.
- `speeds`: Control bubble travel time. Wider ranges create more natural-looking movement patterns.

## Classes & Methods

### FloatingBox Class
```javascript
class FloatingBox {
    constructor()
    initialize()
    setupEventListeners()
    handleMouseMove(e)
    handleMouseEnter()
    handleMouseLeave()
    updateTargetPosition(x, y)
    updateGlowPosition(e, rect)
    animate()
    updateState()
    updateTransforms()
    lerp(start, end, factor)
}
```

#### Key Method Details

##### updateTargetPosition(x, y)
Calculates target rotation based on mouse position:
```javascript
this.state.targetRotateY = x * CONFIG.box.rotationMax;
this.state.targetRotateX = -y * CONFIG.box.rotationMax;
```
- `x` and `y` are normalized coordinates (-1 to 1)
- Negative y rotation creates natural-feeling tilt
- Multiplication by rotationMax converts to degrees

##### updateTransforms()
Applies calculated transformations:
1. Generates perspective transform matrix
2. Applies Z-axis translation
3. Applies X and Y rotation
4. Updates shadow position and scale
5. Maintains transform origin at center

##### lerp(start, end, factor)
Linear interpolation function:
```javascript
return start + (end - start) * factor;
```
- Used for smooth transitions
- `factor` determines speed (CONFIG.box.motionSpeed)
- Applied to all transformations

### BubbleManager Class
```javascript
class BubbleManager {
    constructor()
    initialize()
    createNewBubble()
}
```

#### Bubble Creation Process
1. Generate random size within configured range
2. Select random color from palette
3. Calculate animation duration
4. Position at random horizontal point
5. Apply diagonal movement (50% chance)
6. Setup recreation on animation end

## Visual Effects

### Glass Morphism
Implemented through multiple layers:
```css
.floating-box {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.7),
        0 5px 15px rgba(0, 0, 0, 0.4),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
```

### Dynamic Glow
Radial gradient following mouse position:
```css
.glow {
    background: radial-gradient(
        circle at var(--mouse-x) var(--mouse-y),
        rgba(255, 255, 255, 0.2),
        transparent 50%
    );
}
```

### Shadow Projection
Dynamic shadow with size and position updates:
- Scale adjusts based on Z-height
- Position offset based on rotation
- Opacity varies with scale
- Blur radius remains constant

## Animation System

### Transform Pipeline
1. Mouse position normalized to -1 to 1
2. Position converted to rotation angles
3. Linear interpolation applied
4. Transform matrix generated
5. Shadow transforms calculated
6. RequestAnimationFrame loop maintains smoothness

### Bubble Animation
Two movement patterns:
1. Vertical (float):
```css
@keyframes float {
    0% { transform: translateY(100vh); }
    100% { transform: translateY(-100vh); }
}
```

2. Diagonal (floatDiagonal):
```css
@keyframes floatDiagonal {
    0% { transform: translateY(100vh) translateX(-50px); }
    100% { transform: translateY(-100vh) translateX(150px); }
}
```

## Performance Considerations

### Transform Optimization
- Uses `will-change: transform` for GPU acceleration
- Maintains 3D transform-style hierarchy
- Avoids layout thrashing by batching DOM reads/writes

### Animation Efficiency
- RequestAnimationFrame for smooth timing
- CSS transforms instead of position properties
- Efficient bubble recycling system
- Optimal number of simultaneous elements

### Memory Management
- Bubbles properly removed after animation
- Event listeners cleaned up appropriately
- DOM manipulation minimized
- Efficient state management

## Browser Compatibility

### Required Features
- CSS Transform 3D
- RequestAnimationFrame
- Backdrop Filter
- CSS Custom Properties
- Modern Event Handling

### Fallback Behaviors
- Backdrop filter fallback to opacity
- Transform fallback to 2D
- CSS animation fallback to basic transitions

## Customization Guide

### Adding New Effects
1. Define new properties in CONFIG
2. Add corresponding CSS classes
3. Implement in FloatingBox/BubbleManager
4. Update animation pipeline if needed

### Modifying Animations
1. Adjust timing in CONFIG.box.motionSpeed
2. Modify lerp factors for different feels
3. Add new transform calculations
4. Update CSS keyframes as needed

### Visual Customization
1. Modify CONFIG.box for core properties
2. Update CSS variables for colors
3. Adjust shadow and glow parameters
4. Modify bubble colors and sizes

### Performance Tuning
1. Adjust bubble count based on target devices
2. Modify animation complexities
3. Update transform precision
4. Balance visual effects with performance

## Advanced Usage

### State Management
The FloatingBox maintains internal state:
```javascript
this.state = {
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    targetRotateX: 0,
    targetRotateY: 0,
    targetTranslateZ: 0
};
```

### Event System
Comprehensive event handling:
1. Mouse movement tracking
2. Enter/leave state management
3. Animation frame scheduling
4. Bubble lifecycle management

### Extension Points
1. CONFIG object modification
2. Class inheritance
3. Event handler override
4. Animation system extension

This documentation provides a comprehensive overview of the project's technical aspects. For specific implementation details, refer to the source code comments and inline documentation.