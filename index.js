const express = require("express");
const userRoutes = require("./routes/userAuthentication"); 
const eventCategoryRoutes = require("./routes/eventCategory");
const eventRoutes = require("./routes/eventRoutes"); 
const rsvpRoutes = require("./routes/rsvpRoute"); 
const app = express();
const port = process.env.PORT || 3000; 
const rateLimiter = require("./middlewares/rateLimiter");
const loggingMiddleware = require("./middlewares/loggingMiddleware");
const cors = require('cors');

app.use(cors());
app.use(express.json()); 
// app.use(rateLimiter);
app.use(loggingMiddleware);
app.use('/authenticate', userRoutes); 
app.use("/eventCategory", eventCategoryRoutes); 
app.use("/events", eventRoutes); 
app.use("/rsvp", rsvpRoutes); 

app.listen(port, ()=> console.log(`Running on port ${port}`)); 