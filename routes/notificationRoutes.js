const express = require("express");
const notificationController = require("../controllers/notificationsController"); 
const authMiddleware = require("../middlewares/authenticateToken"); 

const notificationRouter = express.Router();
notificationRouter.get("/getAllNotifications", notificationController.getAllNotifications);
notificationRouter.patch("/markAsRead/:userID/:notificationID", notificationController.markAsRead);
notificationRouter.delete("/deleteNotifcaiton/:userID/:notificationID", notificationController.deleteNotification);


module.exports = notificationRouter;