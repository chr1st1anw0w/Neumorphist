// This constant holds default Neumorphism styles for Figma-like usage.
export const NEUMORPHISM_STYLES = {
  fill: "#ffffff",
  borderRadius: 8,
  boxShadow: "4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff",
  // You can add other relevant properties here in a way that maps to Figma styles
  // For instance:
  // stroke: "#cccccc"
};

export const applyUIVariants = (css: string, spreadValue: number) => {
  return css
    .replace(/position:\s*absolute;/g, '')
    .replace(/(\d+)px/g, (_, p1) => `${parseInt(p1)/16}rem`)
    .replace(/box-shadow:\s*([^;]+);/g, (match, shadow) => {
      const formattedSpread = convertShadow(spreadValue); // Use convertShadow to get the formatted string
      return `box-shadow: ${shadow.replace(/(\d+px)/g, '$1 ' + formattedSpread)}`;
    });
};

// This function is now correctly used by applyUIVariants
export function convertShadow(spreadValue: number) {
  return `${spreadValue}px`;
}
