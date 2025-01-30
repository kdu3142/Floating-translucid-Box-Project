/**
 * Main application script for the Interactive 3D Floating Boxes project
 * This module implements the core interaction and animation logic
 * 
 * Dependencies:
 * - config.js: Provides CONFIG object and CSS variable generation
 * - Styles.css: Contains all visual styling and animations
 * - FloatingBox.html: DOM structure
 */

import { CONFIG, generateCSSVariables } from './config.js';

/**
 * Utility class for animation calculations and transformations
 * Used by both FloatingBox and BubbleManager for smooth animations
 */
class AnimationManager {
    /**
     * Linear interpolation function for smooth transitions
     * @param {number} start - Initial value
     * @param {number} end - Target value
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Generates a random number within a range
     * Used for bubble animations and positioning
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number within range
     */
    static getRandomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}

/**
 * Manages the background bubble animation system
 * Creates and animates decorative bubbles defined in CONFIG.bubbles
 * @see CONFIG.bubbles in config.js for animation parameters
 */
class BubbleManager {
    /**
     * Initializes the bubble container and starts bubble generation
     * Container is prepended to body to ensure it's behind other elements
     */
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'bubble-container';
        document.body.prepend(this.container);
        this.initialize();
    }

    /**
     * Creates initial set of bubbles based on CONFIG.bubbles.count
     * @see Styles.css for bubble animations (floatUp and sway)
     */
    initialize() {
        for (let i = 0; i < CONFIG.bubbles.count; i++) {
            this.createBubble();
        }
    }

    /**
     * Creates a single animated bubble with randomized properties
     * Applies styles from CONFIG.bubbles and sets up CSS animations
     * 
     * Animation properties:
     * - Size: Random variation based on CONFIG.bubbles.size
     * - Duration: Random variation based on CONFIG.bubbles.animation.duration
     * - Position: Random horizontal placement
     * - Movement: Combined floatUp and sway animations
     */
    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = CONFIG.bubbles.size.base + (Math.random() * CONFIG.bubbles.size.variance);
        const duration = CONFIG.bubbles.animation.duration.base + (Math.random() * CONFIG.bubbles.animation.duration.variance);
        const startDelay = Math.random() * duration;
        const driftX = (Math.random() - 0.5) * 100; // -50px to 50px drift
        const swayAmount = (Math.random() - 0.5) * 40; // -20px to 20px sway

        Object.assign(bubble.style, {
            width: `${size}px`,
            height: `${size}px`,
            background: this.getRandomColor(),
            left: `${Math.random() * 100}%`,
            '--drift-x': `${driftX}px`,
            '--sway-amount': `${swayAmount}px`,
            animation: `
                floatUp ${duration}s linear infinite,
                sway ${duration * 0.5}s ease-in-out infinite
            `,
            animationDelay: `-${startDelay}s`,
            mixBlendMode: 'screen'  // Add blend mode for more vibrant overlaps
        });

        this.container.appendChild(bubble);
    }

    /**
     * Generates random colors for bubbles using configuration
     * 30% chance of gradient, 70% chance of solid color
     * @returns {string} CSS color or gradient value
     * @see CONFIG.bubbles.colors and CONFIG.bubbles.gradients in config.js
     */
    getRandomColor() {
        // Use gradients 30% of the time
        if (Math.random() < 0.3) {
            return CONFIG.bubbles.gradients[
                Math.floor(Math.random() * CONFIG.bubbles.gradients.length)
            ];
        }
        return CONFIG.bubbles.colors[
            Math.floor(Math.random() * CONFIG.bubbles.colors.length)
        ];
    }
}

/**
 * Core class for handling individual floating box behavior
 * Manages 3D transformations, hover effects, and glow animations
 * 
 * @see FloatingBox.html for DOM structure
 * @see Styles.css for visual effects and transitions
 * @see CONFIG in config.js for box-specific settings
 */
class FloatingBox {
    /**
     * @param {HTMLElement} element - The floating box DOM element
     */
    constructor(element) {
        this.wrapper = element.parentElement;
        this.box = element;
        this.glow = element.querySelector('.glow');
        this.boxConfig = CONFIG[this.box.id]; // Get specific box configuration
        this.state = {
            current: { rotateX: 0, rotateY: 0, translateZ: 0 },
            target: { rotateX: 0, rotateY: 0, translateZ: 0 }
        };
        this.isHovered = false;
        this.boundUpdateFrame = this.updateFrame.bind(this);
        this.initialize();
    }

    /**
     * Sets up the animation loop and event listeners
     * Uses requestAnimationFrame for smooth performance
     */
    initialize() {
        this.setupEventListeners();
        requestAnimationFrame(this.boundUpdateFrame);
    }

    /**
     * Binds mouse interaction events to the box
     * Handles hover states and 3D transformations
     */
    setupEventListeners() {
        this.box.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.box.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.box.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    /**
     * Calculates rotation angles based on mouse position
     * Maps mouse coordinates to rotation values using CONFIG.boxConfig.rotationMax
     * @param {MouseEvent} e - Mouse event object
     */
    handleMouseMove(e) {
        if (!this.isHovered) return;
        
        const rect = this.box.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;

        this.state.target = {
            rotateX: -y * this.boxConfig.rotationMax,
            rotateY: x * this.boxConfig.rotationMax,
            translateZ: this.boxConfig.hoverHeight
        };

        this.updateGlowPosition(e, rect);
    }

    /**
     * Handles mouse enter state
     * Enables immediate transitions and glow effect
     */
    handleMouseEnter() {
        this.isHovered = true;
        this.box.style.transition = 'none';
        this.glow.style.opacity = this.boxConfig.glowOpacity;
    }

    /**
     * Handles mouse leave state
     * Resets transforms and applies smooth transition back
     */
    handleMouseLeave() {
        this.isHovered = false;
        this.state.target = { rotateX: 0, rotateY: 0, translateZ: 0 };
        this.box.style.transition = `transform ${this.boxConfig.transitionDuration} ${this.boxConfig.transitionTiming}`;
        this.glow.style.opacity = '0';
    }

    /**
     * Updates glow effect position based on mouse coordinates
     * Uses CSS custom properties for dynamic positioning
     * @param {MouseEvent} e - Mouse event object
     * @param {DOMRect} rect - Box bounding rectangle
     */
    updateGlowPosition(e, rect) {
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
        
        this.glow.style.setProperty('--mouse-x', `${x}%`);
        this.glow.style.setProperty('--mouse-y', `${y}%`);
    }

    /**
     * Animation frame update callback
     * Maintains smooth animation loop using requestAnimationFrame
     */
    updateFrame() {
        this.updateTransforms();
        requestAnimationFrame(this.boundUpdateFrame);
    }

    /**
     * Applies LERP-based smooth transitions to transforms
     * Uses AnimationManager.lerp for calculation
     */
    updateTransforms() {
        const { current, target } = this.state;
        const speed = this.boxConfig.motionSpeed;

        ['rotateX', 'rotateY', 'translateZ'].forEach(prop => {
            current[prop] = AnimationManager.lerp(current[prop], target[prop], speed);
        });

        if (!this.isHovered && this.isNearRest()) {
            Object.assign(current, { rotateX: 0, rotateY: 0, translateZ: 0 });
        }

        // Apply transforms to the box directly
        this.box.style.transform = `
            translateZ(${current.translateZ}px)
            rotateX(${current.rotateX}deg)
            rotateY(${current.rotateY}deg)
        `;
    }

    /**
     * Checks if box is close enough to rest position
     * Uses CONFIG.boxConfig.snapThreshold for comparison
     * @returns {boolean} True if box should snap to rest
     */
    isNearRest() {
        return ['rotateX', 'rotateY', 'translateZ'].every(prop => 
            Math.abs(this.state.current[prop]) < this.boxConfig.snapThreshold
        );
    }
}

/**
 * Application initialization
 * Sets up CSS variables, creates bubble background, and initializes boxes
 * @see generateCSSVariables in config.js
 */
document.addEventListener('DOMContentLoaded', () => {
    generateCSSVariables();
    new BubbleManager();
    
    // Initialize each box separately
    document.querySelectorAll('.floating-box').forEach(box => {
        new FloatingBox(box);
    });
});