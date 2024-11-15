const express = require("express");
const userRoutes = require("./routes/userAuthentication"); 
const app = express();
const port = process.env.PORT || 3000; 
const rateLimiter = require("./middlewares/rateLimiter");
const loggingMiddleware = require("./middlewares/loggingMiddleware");

app.use(express.json()); 
app.use(rateLimiter);
app.use(loggingMiddleware);
app.use('/', userRoutes); 

app.listen(port, ()=> console.log(`Running on port ${port}`)); 