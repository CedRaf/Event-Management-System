const express = require("express");
const rsvpController = require("../controllers/rsvpController");
const authMiddleware = require("../middlewares/authenticateToken"); 

const rsvpRouter = express.Router();
rsvpRouter.post("/create", authMiddleware, rsvpController.createRSVP); 
rsvpRouter.delete("/delete", rsvpController.deleteRSVP); 
rsvpRouter.patch("/edit/:rsvpID", rsvpController.editRSVP); 
rsvpRouter.get("/getRecipients/:rsvpID", rsvpController.getRSVPRecipients);
rsvpRouter.get("/getDetails/:eventID",  rsvpController.getRSVPDetails); 
rsvpRouter.get("/getRSVPs/:userID", rsvpController.getUserRSVPs); 


module.exports = rsvpRouter;
