const Joi = require('joi');
const { sanitizeObject } = require('../utils/sanitize');

/**
 * Validate request payload using Joi and sanitize recursively.
 * property can be 'body' | 'query' | 'params'
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    try {
      const data = req[property] ?? {};
      const options = {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      };
      const { value, error } = schema.validate(data, options);
      if (error) {
        const details = error.details.map(d => ({ message: d.message, path: d.path }));
        return res.status(400).json({ error: 'Validation failed', details });
      }
      req[property] = sanitizeObject(value);
      return next();
    } catch (e) {
      return res.status(400).json({ error: 'Validation error' });
    }
  };
}

module.exports = { validate };
