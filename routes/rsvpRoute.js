const express = require("express");
const rsvpController = require("../controllers/rsvpController");
const authMiddleware = require("../middlewares/authenticateToken"); 

const rsvpRouter = express.Router();
rsvpRouter.post("/create", rsvpController.createRSVP); 
rsvpRouter.delete("/delete", rsvpController.deleteRSVP); 

module.exports = rsvpRouter;
