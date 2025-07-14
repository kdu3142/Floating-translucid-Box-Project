# [Interactive 3D Floating Boxes with Dynamic Background](https://kdu3142.github.io/Floating-translucid-Box-Project/FloatingBox.html)
## Technical Documentation & Implementation Guide

## Project Architecture

### Core Components
1. **Box System**
   - Dual independent floating boxes with separate configurations
   - Individual state management per box
   - Box-specific hover and interaction handling

2. **Animation System**
   - Centralized animation management
   - Linear interpolation (LERP) for smooth transitions
   - Frame-based animation updates

3. **Background System**
   - Dynamic bubble generation
   - Multi-layer animations
   - Gradient-based color management

## Technical Implementation

### Configuration System
The project uses a modular configuration system with three main components:

```javascript
CONFIG = {
    box1: {...},     // First box configuration
    box2: {...},     // Second box configuration
    bubbles: {...},  // Background animation settings
    scene: {...}     // Global environment settings
}
```

#### Box Configuration Properties
Each box (box1/box2) has independent settings:
```javascript
{
    width: string,            // Box dimensions
    height: string,
    borderRadius: string,     // Visual properties
    rotationMax: number,      // Maximum rotation angle (degrees)
    hoverHeight: number,      // Z-axis lift on hover (pixels)
    motionSpeed: number,      // Animation smoothing (0-1)
    background: string,       // RGBA background color
    blur: string,            // Backdrop filter blur
    saturation: string,      // Backdrop filter saturation
    borderColor: string,     // RGBA border color
    glowOpacity: number,     // Hover glow intensity
    glowBlur: string,        // Glow effect blur radius
    glowColor: string,       // RGBA glow color
    shadowBlur: string,      // Box shadow blur
    shadowColor: string,     // RGBA shadow color
    transitionDuration: string, // Animation timings
    transitionTiming: string,
    snapThreshold: number    // Position reset threshold
}
```

### Class Structure

#### FloatingBox Class
```javascript
class FloatingBox {
    constructor(element) {
        this.boxConfig = CONFIG[this.box.id];  // Box-specific config
        this.state = {
            current: { rotateX, rotateY, translateZ },
            target: { rotateX, rotateY, translateZ }
        };
    }
}
```

Key Methods:
- `handleMouseMove(e)`: Calculates rotation based on mouse position
- `updateTransforms()`: Applies LERP-based smooth transitions
- `isNearRest()`: Determines when to reset position

#### AnimationManager Class
Static utility class for animation calculations:
```javascript
class AnimationManager {
    static lerp(start, end, factor)
    static getRandomRange(min, max)
}
```

#### BubbleManager Class
Handles background animation system:
```javascript
class BubbleManager {
    createBubble() {
        // Dynamic bubble generation with:
        // - Random size variation
        // - Random animation duration
        // - Random drift and sway
        // - Gradient/solid color selection
    }
}
```

### CSS Architecture

#### Box Styling System
- Individual box styles using CSS variables
- Backdrop filter effects for glass morphism
- 3D transform handling
- Hover effect management

```css
.floating-box {
    transform-style: preserve-3d;
    will-change: transform;
    backface-visibility: hidden;
}

#box1, #box2 {
    /* Box-specific styles using CSS variables */
}
```

#### Animation System
```css
@keyframes floatUp {
    0% { transform: translate(0, 120vh); }
    100% { transform: translate(var(--drift-x), -150%); }
}

@keyframes sway {
    0%, 100% { margin-left: 0; }
    50% { margin-left: var(--sway-amount); }
}
```

### Performance Optimizations

1. **Transform Optimizations**
   - Use of `will-change: transform`
   - Hardware acceleration via `transform: translateZ(0)`
   - Backface visibility optimization

2. **Animation Performance**
   - RequestAnimationFrame for smooth animations
   - Efficient state management
   - Optimized transform calculations

3. **Memory Management**
   - Proper event listener cleanup
   - Efficient DOM manipulation
   - Controlled bubble count

## Implementation Guide

### Adding New Box Features
1. Add configuration properties to `box1`/`box2` in `config.js`
2. Update FloatingBox class to handle new properties
3. Add corresponding CSS variables and styles

### Modifying Animations
1. Adjust timing in configuration:
```javascript
transitionDuration: '0.5s',
transitionTiming: 'ease-out'
```
2. Modify LERP factor for smoothing:
```javascript
motionSpeed: 0.25  // Lower = smoother, higher = responsive
```

### Customizing Visual Effects
1. Adjust blur and saturation:
```javascript
blur: '40px',
saturation: '180%'
```
2. Modify glow effect:
```javascript
glowOpacity: 0.2,
glowBlur: '50px',
glowColor: 'rgba(255, 255, 255, 0.3)'
```

## Browser Compatibility

### Requirements
- Modern CSS support (CSS Variables, 3D Transforms)
- ES6+ JavaScript support
- Backdrop Filter support (or fallback)

### Performance Considerations
- Monitor frame rates with heavy bubble counts
- Adjust animation complexity based on device capability
- Consider reducing effects on mobile devices

## Debug Tips
1. Monitor transform states via console.log in updateTransforms()
2. Check box configuration loading with this.boxConfig
3. Verify CSS variable generation in the root element
4. Monitor bubble creation and animation performance

This documentation provides a technical foundation for understanding and extending the project's functionality.