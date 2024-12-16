const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMS: 30 * 1000,
    max: 50,
    message: "Too many requests, try again in 30 seconds",
    headers: true,
});

module.exports = rateLimiter; 