const express = require("express");
const userRoutes = require("./routes/userAuthentication"); 
const eventCategoryRoutes = require("./routes/eventCategory");
const app = express();
const port = process.env.PORT || 3000; 
const rateLimiter = require("./middlewares/rateLimiter");
const loggingMiddleware = require("./middlewares/loggingMiddleware");

app.use(express.json()); 
app.use(rateLimiter);
app.use(loggingMiddleware);
app.use('/authenticate', userRoutes); 
app.use("/eventCategory", eventCategoryRoutes); 

app.listen(port, ()=> console.log(`Running on port ${port}`)); 