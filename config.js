/**
 * Global configuration object for the Interactive 3D Floating Boxes project
 * Centralizes all customizable parameters for boxes, animations, and scene
 * 
 * @namespace CONFIG
 * @exports CONFIG
 * @exports generateCSSVariables
 */
export const CONFIG = {
    /**
     * Primary floating box configuration
     * Controls visual appearance and interaction behavior
     * @see FloatingBox class in Script.js
     */
    box1: {
        // Physical dimensions
        width: '300px',           // Box width (CSS units)
        height: '300px',          // Box height (CSS units)
        borderRadius: '30px',     // Corner rounding

        // Interaction parameters
        rotationMax: 15,          // Maximum rotation angle on hover
        hoverHeight: 100,         // Z-axis translation on hover (pixels)
        motionSpeed: 0.25,        // LERP interpolation factor (0-1)

        // Visual effects
        background: 'rgba(0, 0, 0, 0.2)',         // Base background color
        blur: '40px',                             // Backdrop filter blur amount
        saturation: '180%',                       // Backdrop filter saturation
        borderColor: 'rgba(255, 255, 255, 0.1)',  // Border highlight
        
        // Glow effect parameters
        glowOpacity: 0.2,                         // Maximum glow intensity
        glowBlur: '50px',                         // Glow spread radius
        glowColor: 'rgba(255, 255, 255, 0.3)',    // Glow color

        // Shadow configuration
        shadowBlur: '20px',                       // Shadow blur radius
        shadowColor: 'rgba(0, 0, 0, 0.3)',        // Shadow color

        // Animation timing
        transitionDuration: '0.5s',               // Duration for reset animation
        transitionTiming: 'ease-out',             // Easing function
        snapThreshold: 0.01                       // Position reset threshold
    },

    /**
     * Secondary floating box configuration
     * Inherits same structure as box1 with different values
     */
    box2: {
        width: '300px',
        height: '300px',
        borderRadius: '30px',
        rotationMax: 15,
        hoverHeight: 100,
        motionSpeed: 0.25,
        background: 'rgba(0, 0, 0, 0.2)',
        blur: '20px',
        saturation: '180%',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        glowOpacity: 0.2,
        glowBlur: '50px',
        glowColor: 'rgba(255, 255, 255, 0.3)',
        shadowBlur: '20px',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        transitionDuration: '0.5s',
        transitionTiming: 'ease-out',
        snapThreshold: 0.01
    },

    /**
     * Background animation system configuration
     * Controls bubble generation and animation parameters
     * @see BubbleManager class in Script.js
     */
    bubbles: {
        count: 50,           // Total number of animated elements
        
        /**
         * Bubble size configuration
         * Final size = base + (random * variance)
         */
        size: {
            base: 50,        // Minimum bubble size (pixels)
            variance: 30     // Random additional size (pixels)
        },

        /**
         * Predefined color palette for bubbles
         * Used for solid color bubbles (70% chance)
         * All colors use full opacity for blend modes
         */
        colors: [
            'rgba(255, 107, 107, 1)',             // coral red
            'rgba(147, 64, 255, 1)',              // purple
            'rgba(77, 171, 247, 1)',              // blue
            'rgba(255, 189, 89, 1)',              // golden
            'rgba(76, 217, 105, 1)',              // green
            'rgba(252, 83, 154, 1)',              // pink
            'rgba(59, 178, 208, 1)',              // cyan
            'rgba(255, 145, 48, 1)',              // orange
            'rgba(180, 129, 255, 1)',             // lavender
            'rgba(255, 223, 89, 1)'               // yellow
        ],

        /**
         * Predefined gradients for complex bubbles
         * Used for gradient bubbles (30% chance)
         * @see BubbleManager.getRandomColor()
         */
        gradients: [
            'linear-gradient(45deg, rgba(255,107,107,1), rgba(255,189,89,1))',    // coral to golden
            'linear-gradient(45deg, rgba(147,64,255,1), rgba(77,171,247,1))',     // purple to blue
            'linear-gradient(45deg, rgba(252,83,154,1), rgba(180,129,255,1))',    // pink to lavender
            'linear-gradient(45deg, rgba(76,217,105,1), rgba(59,178,208,1))'      // green to cyan
        ],

        /**
         * Animation timing configuration
         * Controls bubble float speed and variations
         */
        animation: {
            duration: {
                base: 12,       // Minimum animation duration (seconds)
                variance: 4     // Random additional time (seconds)
            }
        }
    },

    /**
     * Global scene configuration
     * Controls 3D environment and layout parameters
     * @see Styles.css for implementation
     */
    scene: {
        perspective: '1000px',     // 3D perspective depth
        padding: '50px',           // Scene padding
        containerGap: '40px'       // Space between boxes
    }
};

/**
 * Utility function to convert CONFIG object to CSS custom properties
 * Automatically generates CSS variables for all configuration values
 * 
 * @example
 * // CONFIG.box1.width = '300px' becomes --box1-width: 300px
 * // CONFIG.bubbles.size.base = 50 becomes --bubbles-size-base: 50
 * 
 * @see Styles.css for usage of generated variables
 */
export function generateCSSVariables() {
    const root = document.documentElement;
    
    const setVar = (prefix, obj) => {
        for (const [key, value] of Object.entries(obj)) {
            const cssKey = prefix ? `${prefix}-${key}` : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                setVar(cssKey, value);
            } else {
                root.style.setProperty(`--${cssKey}`, value);
            }
        }
    };
    
    // Apply scene variables
    setVar('scene', CONFIG.scene);
    
    // Apply box-specific variables
    setVar('box1', CONFIG.box1);
    setVar('box2', CONFIG.box2);
    
    // Apply bubble variables
    setVar('bubbles', CONFIG.bubbles);
}
