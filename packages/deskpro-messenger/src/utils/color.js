/**
 * Returns true if opposite color is light or not.
 * @param {string} color Color hash.
 * @link https://stackoverflow.com/a/35970186
 */
export const isLightColor = (color) => {
  let hex = color.startsWith('#') ? color.slice(1) : color;
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  // http://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};
