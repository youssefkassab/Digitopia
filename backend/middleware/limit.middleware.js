const rateLimit = require('express-rate-limit');

// Login/signup limiter (moderate)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many attempts, please try again later."
});

// Public message send limiter (stricter)
const messageLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // Only 3 messages per 10 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many messages, slow down and try again later."
});

// Keep default export for backward-compatibility
module.exports = loginLimiter;
// Also export named limiters for fine-grained control
module.exports.loginLimiter = loginLimiter;
module.exports.messageLimiter = messageLimiter;