export const CONFIG = {
    // Box configuration controls the appearance and behavior of the floating boxes
    box: {
        width: '300px',                              // Width of each floating box
        height: '300px',                            // Height of each floating box
        borderRadius: '30px',                       // Corner rounding of the box
        rotationMax: 15,                           // Maximum rotation angle on hover (degrees)
        hoverHeight: 100,                           // How far the box "lifts" on hover (pixels)
        motionSpeed: 0.25,                         // Speed of box movement animations (0-1)
        background: 'rgba(0, 0, 0, 0.2)',          // Box background color and opacity
        blur: '20px',                              // Backdrop blur effect intensity
        saturation: '180%',                        // Color saturation for backdrop filter
        borderColor: 'rgba(255, 255, 255, 0.1)',   // Color of box border
        glowOpacity: 0.2,                          // Maximum opacity of hover glow effect
        glowBlur: '50px',                          // Blur radius of the glow effect
        glowColor: 'rgba(255, 255, 255, 0.3)',     // Color of the hover glow effect
        shadowBlur: '20px',                        // Box shadow blur radius
        shadowColor: 'rgba(0, 0, 0, 0.3)',         // Box shadow color
        transitionDuration: '0.5s',                // Duration of hover transitions
        transitionTiming: 'ease-out',              // Timing function for transitions
        snapThreshold: 0.01                        // Threshold for snapping to rest position
    },

    // Bubble configuration controls the background animation elements
    bubbles: {
        count: 50,                                 // Number of bubbles to create
        size: {
            base: 50,                              // Base size of bubbles (pixels)
            variance: 30                           // Random size variation added to base
        },
        // Array of bubble colors with full opacity
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
        // Gradient options for more complex bubble appearances
        gradients: [
            'linear-gradient(45deg, rgba(255,107,107,1), rgba(255,189,89,1))',    // coral to golden
            'linear-gradient(45deg, rgba(147,64,255,1), rgba(77,171,247,1))',     // purple to blue
            'linear-gradient(45deg, rgba(252,83,154,1), rgba(180,129,255,1))',    // pink to lavender
            'linear-gradient(45deg, rgba(76,217,105,1), rgba(59,178,208,1))'      // green to cyan
        ],
        animation: {
            duration: {
                base: 12,                          // Base duration of bubble animation (seconds)
                variance: 4                        // Random time added to base duration
            }
        }
    },

    // Scene configuration controls the overall 3D environment
    scene: {
        perspective: '1000px',                     // 3D perspective depth
        padding: '50px',                          // Padding around the scene
        containerGap: '40px'                      // Gap between floating boxes
    }
};

/**
 * Converts the CONFIG object into CSS variables
 * Recursively processes nested objects and creates corresponding CSS custom properties
 * Example: box.width becomes --box-width
 */
export function generateCSSVariables() {
    const root = document.documentElement;
    const setVar = (prefix, obj) => {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object') {
                setVar(`${prefix}${key}-`, value);
            } else {
                root.style.setProperty(`--${prefix}${key}`, value);
            }
        }
    };
    setVar('', CONFIG);
}
