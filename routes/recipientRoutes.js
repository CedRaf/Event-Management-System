const express = require("express");
const recipientController = require("../controllers/recipientController");
const authMiddleware = require("../middlewares/authenticateToken"); 

const recipientRouter = express.Router(); 
recipientRouter.patch("/rsvpStatusUpdate/:rsvpID/:userID", authMiddleware, recipientController.rsvpResponse);
recipientRouter.patch("/cancelRSVP/:rsvpID/:userID", authMiddleware, recipientController.cancelRSVP);

module.exports = recipientRouter;