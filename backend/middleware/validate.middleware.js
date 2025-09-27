const Joi = require('joi');
const { sanitizeObject } = require('../utils/sanitize');

/**
 * Create an Express middleware that validates and sanitizes a request property against a Joi schema.
 *
 * @param {import('joi').Schema} schema - Joi schema used to validate the request data.
 * @param {('body'|'query'|'params')} [property='body'] - The request property to validate and sanitize.
 * @returns {import('express').RequestHandler} An Express middleware that validates req[property], replaces it with the sanitized validated value on success, and responds with HTTP 400 and error details on validation failure.
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
