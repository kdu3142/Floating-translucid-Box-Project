import { CONFIG, generateCSSVariables } from './config.js';

class AnimationManager {
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static getRandomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}

class BubbleManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'bubble-container';
        document.body.prepend(this.container);
        this.initialize();
    }

    initialize() {
        for (let i = 0; i < CONFIG.bubbles.count; i++) {
            this.createBubble();
        }
    }

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

class FloatingBox {
    constructor(element) {
        this.wrapper = element.parentElement;
        this.box = element;
        this.glow = element.querySelector('.glow');
        this.state = {
            current: { rotateX: 0, rotateY: 0, translateZ: 0 },
            target: { rotateX: 0, rotateY: 0, translateZ: 0 }
        };
        this.isHovered = false;
        this.boundUpdateFrame = this.updateFrame.bind(this);
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        requestAnimationFrame(this.boundUpdateFrame);
    }

    setupEventListeners() {
        this.box.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.box.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.box.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    handleMouseMove(e) {
        if (!this.isHovered) return;
        
        const rect = this.box.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = (e.clientY - rect.top) / rect.height * 2 - 1;

        this.state.target = {
            rotateX: -y * CONFIG.box.rotationMax,
            rotateY: x * CONFIG.box.rotationMax,
            translateZ: CONFIG.box.hoverHeight
        };

        this.updateGlowPosition(e, rect);
    }

    handleMouseEnter() {
        this.isHovered = true;
        this.box.style.transition = 'none';
        this.glow.style.opacity = CONFIG.box.glowOpacity;
    }

    handleMouseLeave() {
        this.isHovered = false;
        this.state.target = { rotateX: 0, rotateY: 0, translateZ: 0 };
        this.box.style.transition = `transform ${CONFIG.box.transitionDuration} ${CONFIG.box.transitionTiming}`;
        this.glow.style.opacity = '0';
    }

    updateGlowPosition(e, rect) {
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
        
        this.glow.style.setProperty('--mouse-x', `${x}%`);
        this.glow.style.setProperty('--mouse-y', `${y}%`);
    }

    updateFrame() {
        this.updateTransforms();
        requestAnimationFrame(this.boundUpdateFrame);
    }

    updateTransforms() {
        const { current, target } = this.state;
        const speed = CONFIG.box.motionSpeed;

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

    isNearRest() {
        return ['rotateX', 'rotateY', 'translateZ'].every(prop => 
            Math.abs(this.state.current[prop]) < CONFIG.box.snapThreshold
        );
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateCSSVariables();
    new BubbleManager();
    
    // Initialize each box separately
    document.querySelectorAll('.floating-box').forEach(box => {
        new FloatingBox(box);
    });
});