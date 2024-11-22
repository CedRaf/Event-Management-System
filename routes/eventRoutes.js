const express = require("express");
const eventController = require("../controllers/eventsController"); 

const eventsRouter = express.Router(); 
eventsRouter.post("/create", eventController.createEvent);
eventsRouter.delete("/delete", eventController.deleteEvent);
eventsRouter.patch("/edit/:eventID", eventController.editEvent); 
eventsRouter.get("/find/:event_title", eventController.findEvent); 
eventsRouter.get("/findAll", eventController.getAllEvents); 


module.exports = eventsRouter;