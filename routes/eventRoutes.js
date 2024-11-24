const express = require("express");
const eventController = require("../controllers/eventsController"); 
const authMiddleware = require("../middlewares/authenticateToken"); 

const eventsRouter = express.Router(); 
eventsRouter.post("/create", eventController.createEvent); //new event entity
eventsRouter.delete("/delete/:eventID", authMiddleware, eventController.deleteEvent); //no body
eventsRouter.patch("/edit/:eventID", authMiddleware, eventController.editEvent);  //body: updated event entity
eventsRouter.get("/find/:userID", authMiddleware, eventController.findEvent);  //event_title
eventsRouter.get("/findAll/:userID", authMiddleware, eventController.getAllEvents); 
eventsRouter.get("/findByCategory/:categoryID", authMiddleware, eventController.getEventsByCategory);
eventsRouter.get("/sort/:sortBy/:orderBy?", authMiddleware, eventController.sortEvents);


module.exports = eventsRouter;