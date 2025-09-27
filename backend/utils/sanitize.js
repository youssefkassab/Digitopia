/**
 * Sanitize a string value by trimming, removing null bytes and control characters (except LF and CR), and collapsing consecutive whitespace into single spaces.
 * Non-string inputs are returned unchanged.
 * @param {*} val - The value to sanitize; strings are normalized, other types are returned as-is.
 * @returns {string|*} The sanitized string if `val` was a string, otherwise the original `val`.
 */
function sanitizeValue(val) {
  if (typeof val === 'string') {
    let s = val.trim();
    // Remove null bytes and common control chars except \n and \r
    s = s.replace(/[\u0000\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    // Collapse excessive whitespace
    s = s.replace(/\s{2,}/g, ' ');
    return s;
  }
  return val;
}

/**
 * Recursively sanitize a value, trimming and cleaning string leaves while preserving other primitives.
 *
 * If `input` is an array, returns a new array with each element sanitized. If it's a non-null object, returns a new object with the same own enumerable keys and sanitized values. For other types, strings are sanitized (trimmed, null bytes and most control characters removed except `\n` and `\r`, and consecutive whitespace collapsed) and non-string primitives are returned unchanged.
 * @param {*} input - The value to sanitize (may be any primitive, array, or plain object).
 * @returns {*} A new sanitized value with the same structure as `input`. Strings are cleaned; arrays and objects are reconstructed with sanitized leaf values; other primitives are returned as-is.
 */
function sanitizeObject(input) {
  if (Array.isArray(input)) {
    return input.map((v) => sanitizeObject(v));
  }
  if (input && typeof input === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = sanitizeObject(v);
    }
    return out;
  }
  return sanitizeValue(input);
}

module.exports = { sanitizeObject };
