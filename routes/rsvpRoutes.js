const express = require("express");
const rsvpController = require("../controllers/rsvpController");
const authMiddleware = require("../middlewares/authenticateToken"); 

const rsvpRouter = express.Router();
rsvpRouter.post("/create", authMiddleware, rsvpController.createRSVP); 
rsvpRouter.delete("/delete", authMiddleware, rsvpController.deleteRSVP); 
rsvpRouter.patch("/edit/:rsvpID", authMiddleware, rsvpController.editRSVP); 
rsvpRouter.get("/getRecipients/:rsvpID", authMiddleware, rsvpController.getRSVPRecipients);
rsvpRouter.get("/getDetails/:eventID", authMiddleware,  rsvpController.getRSVPDetails); 
rsvpRouter.get("/getRSVPs/:userID", authMiddleware, rsvpController.getUserRSVPs); 


module.exports = rsvpRouter;
