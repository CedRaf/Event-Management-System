const express = require("express");
const eventController = require("../controllers/eventsController"); 
const authMiddleware = require("../middlewares/authenticateToken"); 

const eventsRouter = express.Router(); 
eventsRouter.post("/create", eventController.createEvent);
eventsRouter.delete("/delete", authMiddleware, eventController.deleteEvent);
eventsRouter.patch("/edit/:eventID", authMiddleware, eventController.editEvent); 
eventsRouter.get("/find/:event_title", authMiddleware, eventController.findEvent); 
eventsRouter.get("/findAll", authMiddleware, eventController.getAllEvents); 
eventsRouter.get("/findByCategory/:categoryID", authMiddleware, eventController.getEventsByCategory);
eventsRouter.get("/sort/:sortBy/:orderBy?", authMiddleware, eventController.sortEvents);


module.exports = eventsRouter;