const loggingMiddleware = (req, res, next) => {
    const timeStamp = new Date().toISOString();
    const method = req.method;
    const route = req.path || req.url;

    console.log(`[${timeStamp}], ${method}, ${route}`); 
    next();
}

module.exports = loggingMiddleware; 