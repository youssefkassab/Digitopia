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
