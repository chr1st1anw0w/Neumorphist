// neumorphic/code.ts
// 移除未使用的导入声明
import { NEUMORPHISM_STYLES } from './src/styles';

// This plugin will open a modal to prompt the user to enter CSS styles
figma.showUI(__html__);

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-css') {
    const { styles } = msg;
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify('Please select at least one layer to apply styles.', { timeout: 3000 });
      return;
    }

    try {
      for (const node of selectedNodes) {
        // Check if the node is a valid type to apply styles to (e.g., Rectangle, Frame, Group)
        // You might need to adjust this based on which node types you want to support.
        if ('fills' in node && 'effects' in node && 'cornerRadius' in node) {
          // Apply parsed styles
          if (styles.fill) {
             // Convert hex string to Figma Paint object
             const solidPaint: SolidPaint = {
                type: 'SOLID',
                color: hexToRgbFloat(styles.fill)
             };
             node.fills = [solidPaint];
          }
          if (styles.borderRadius !== undefined) {
            // Ensure cornerRadius is assignable (it is on some node types like Rectangle)
            // If supporting other types, you might need conditional checks or type assertions.
            (node as RectangleNode).cornerRadius = styles.borderRadius;
          }
          if (styles.boxShadow) {
            // This is a simplified approach. Parsing CSS box-shadow to Figma effects
            // is complex and requires handling multiple shadows, inset, spread, etc.
            // For a full implementation, you'd need a more robust CSS parsing library
            // and conversion logic.
            // As a placeholder, we'll just log the shadow string.
            console.log('Attempting to apply box-shadow:', styles.boxShadow);
            const effects = convertCssBoxShadowToFigmaEffects(styles.boxShadow);
            if (effects.length > 0) {
              node.effects = effects;
              figma.notify('Box-shadow applied!', { timeout: 1500 });
            } else {
              figma.notify('Could not parse box-shadow or no shadow defined.', { timeout: 3000 });
            }
          }

          // Ensure no strokes for a typical neumorphism look
          if ('strokes' in node) {
            node.strokes = [];
          }
        } else {
          figma.notify(`Skipping unsupported layer type: ${node.type}`, { timeout: 1500 });
        }
      }
      figma.notify('CSS styles applied (partially implemented)!', { timeout: 2000 });
    } catch (error: any) { // Catch error as any to access message property
      figma.notify(`Error applying styles: ${error.message}`, { timeout: 5000 });
      console.error(error);
    }
  } else if (msg.type === 'apply-preset') {
      const { styles } = msg;
      const selectedNodes = figma.currentPage.selection;

      if (selectedNodes.length === 0) {
        figma.notify('Please select at least one layer to apply preset styles.', { timeout: 3000 });
        return;
      }

      try {
        for (const node of selectedNodes) {
           // Check if the node is a valid type
           if ('fills' in node && 'effects' in node && 'cornerRadius' in node) {
             // Apply preset styles
             if (styles.fill) {
                const solidPaint: SolidPaint = {
                   type: 'SOLID',
                   color: hexToRgbFloat(styles.fill)
                };
                node.fills = [solidPaint];
             }
             if (styles.borderRadius !== undefined) {
               (node as RectangleNode).cornerRadius = styles.borderRadius;
             }
             if (styles.boxShadow) {
               // Convert preset box-shadow string to Figma effects
               // This requires parsing the string like "4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff"
               // and creating Figma DropShadowEffect objects.
               // This is a complex parsing task. A placeholder is used here.
               console.log('Attempting to apply preset box-shadow:', styles.boxShadow);
               const presetEffects = convertCssBoxShadowToFigmaEffects(styles.boxShadow);
               if (presetEffects.length > 0) {
                 node.effects = presetEffects;
                 figma.notify('Preset box-shadow applied!', { timeout: 1500 });
               } else {
                 figma.notify('Could not parse preset box-shadow or no shadow defined.', { timeout: 3000 });
               }
             }

             if ('strokes' in node) {
               node.strokes = [];
             }
          } else {
            figma.notify(`Skipping unsupported layer type: ${node.type}`, { timeout: 1500 });
          }
        }
        figma.notify('Preset styles applied (partially implemented)!', { timeout: 2000 });
      } catch (error: any) { // Catch error as any
        figma.notify(`Error applying preset styles: ${error.message}`, { timeout: 5000 });
        console.error(error);
      }

  } else if (msg.type === 'update-params') {
      const { params } = msg;
      // Handle parameter updates (e.g., shadow strength, base color lightness)
      // You might want to store these parameters and use them when 'apply-neumorphism' is triggered.
      console.log('Parameters updated:', params);
      figma.notify('Parameters updated (logic not fully implemented).', { timeout: 2000 });

  } else if (msg.type === 'apply-neumorphism') {
      // This message is triggered when the main "Apply Neumorphism" button is clicked.
      // Here you would use the stored parameters (shadow strength, base color lightness)
      // and potentially the base color of the selected layer to generate and apply
      // the full neumorphism effect (fills, corner radius, shadows).
      const selectedNodes = figma.currentPage.selection;
      if (selectedNodes.length === 0) {
        figma.notify('Please select at least one layer to apply Neumorphism.', { timeout: 3000 });
        return;
      }
      figma.notify('Applying full Neumorphism effect (logic not fully implemented).', { timeout: 2000 });
      // Implement the logic to calculate and apply neumorphism effects based on parameters and selected node properties.

  } else if (msg.type === 'reset-selection') {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length === 0) {
      figma.notify('No layers selected to reset.', { timeout: 3000 });
      return;
    }
    for (const node of selectedNodes) {
      // Check if the node is a valid type
      if ('fills' in node && 'effects' in node && 'cornerRadius' in node) {
        if ('fills' in node) {
          node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // Reset to white fill
        }
        if ('effects' in node) {
          node.effects = []; // Clear all effects
        }
        if ('cornerRadius' in node) {
          (node as RectangleNode).cornerRadius = 0; // Reset corner radius
        }
        if ('strokes' in node) {
          node.strokes = []; // Clear strokes
        }
      } else {
         figma.notify(`Skipping unsupported layer type for reset: ${node.type}`, { timeout: 1500 });
      }
    }
    figma.notify('Selected layers reset!', { timeout: 2000 });
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Helper function to convert hex color string to Figma RGB object (0-1 range)
function hexToRgbFloat(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 }; // Default to black if invalid
}

// Helper function to convert HSL to Hex (useful for generating preview colors or base colors)
function hslToHex(hsl: { h: number, s: number, l: number }): string {
    const { h, s, l } = hsl;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Function to convert CSS box-shadow string to Figma effects
function convertCssBoxShadowToFigmaEffects(cssBoxShadow: string): ReadonlyArray<Effect> {
  const effects: Effect[] = [];
  // Simplified parser for a single shadow: offsetX offsetY blurRadius spreadRadius color
  // Example: "4px 4px 8px #d1d9e6" or "4px 4px 8px 0px #d1d9e6"
  // This regex is very basic and has limitations.
  const shadowRegex = /^(inset\s+)?(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?(?:\s+(-?\d*\.?\d+)(px)?)?\s+(.+)$/;
  
  // Figma doesn't support multiple comma-separated box-shadows directly in one string for this simple parser.
  // We'll process only the first one if multiple are provided for now.
  const singleShadowString = cssBoxShadow.split(',')[0].trim();
  const match = singleShadowString.match(shadowRegex);

  if (match) {
    const isInset = match[1] ? true : false;
    const offsetX = parseFloat(match[2]);
    const offsetY = parseFloat(match[4]);
    const blurRadius = parseFloat(match[6]);
    // Spread radius: match[8] can be undefined if not provided
    const spreadRadius = match[8] ? parseFloat(match[8]) : 0; 
    const colorString = match[10].trim();

    let color: RGBA | RGB = hexToRgbFloat(colorString); // Assuming hex for simplicity, extend for rgb/rgba
    // Check if hexToRgbFloat returned black (default for invalid) and try parsing rgba/rgb
    if (color.r === 0 && color.g === 0 && color.b === 0 && colorString !== '#000' && colorString !== '#000000' && !colorString.toLowerCase().startsWith('black')) {
        const rgbaMatch = colorString.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);
        if (rgbaMatch) {
            color = {
                r: parseInt(rgbaMatch[1]) / 255,
                g: parseInt(rgbaMatch[2]) / 255,
                b: parseInt(rgbaMatch[3]) / 255,
            };
            if (rgbaMatch[4] !== undefined) {
                (color as RGBA).a = parseFloat(rgbaMatch[4]);
            }
        } else {
             console.warn('Could not parse color:', colorString);
             return []; // Return empty if color parsing fails
        }
    }


    if (isInset) {
      effects.push({
        type: 'INNER_SHADOW',
        color: 'a' in color ? color : {...color, a: 1},
        offset: { x: offsetX, y: offsetY },
        radius: blurRadius, 
        spread: spreadRadius, // Figma's INNER_SHADOW has spread
        visible: true,
        blendMode: 'NORMAL', // Or other blend modes
      } as InnerShadowEffect);
    } else {
      effects.push({
        type: 'DROP_SHADOW',
        color: 'a' in color ? color : {...color, a: 1},
        offset: { x: offsetX, y: offsetY },
        radius: blurRadius,
        spread: spreadRadius, // Figma's DROP_SHADOW has spread
        visible: true,
        blendMode: 'NORMAL', // Or other blend modes
      } as DropShadowEffect);
    }
  } else {
    console.warn('Could not parse CSS box-shadow string:', cssBoxShadow);
  }
  return effects;
}
