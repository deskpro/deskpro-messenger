function normalizeHex(hex) {
  let newHex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (newHex.length < 6) {
    newHex = newHex[0] + newHex[0] + newHex[1] + newHex[1] + newHex[2] + newHex[2];
  }

  return newHex;
}

/**
 * Returns true if opposite color is light or not.
 * @param {string} color Color hash.
 * @link https://stackoverflow.com/a/35970186
 */
export const isLightColor = (color) => {
  let hex = color.startsWith('#') ? color.slice(1) : color;
  hex = normalizeHex(hex);
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  // http://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

export const brighter = (hex, percent) => {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');
  hex = normalizeHex(hex);

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return (
    '#' +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
};

export const darker = (hex, percent) => {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');
  hex = normalizeHex(hex);

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return (
    '#' +
    (0 | ((1 << 8) + r * (1 - percent / 100))).toString(16).substr(1) +
    (0 | ((1 << 8) + g * (1 - percent / 100))).toString(16).substr(1) +
    (0 | ((1 << 8) + b * (1 - percent / 100))).toString(16).substr(1)
  );
};

export function colorLuminance(hex, lum = 0) {
  const newHex = normalizeHex(hex);
  let rgb = '#';
  let c;
  let i;
  for (i = 0; i < 3; i += 1) {
    c = parseInt(newHex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += (`00${c}`).substr(c.length);
  }

  return rgb;
}

