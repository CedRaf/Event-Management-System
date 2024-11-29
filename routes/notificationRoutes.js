const express = require("express");
const notificationController = require("../controllers/notificationsController"); 
const authMiddleware = require("../middlewares/authenticateToken"); 

const notificationRouter = express.Router();
notificationRouter.get("/getAllNotifications/:userID", notificationController.getAllNotifications);
notificationRouter.patch("/markAsRead/:notificationID", notificationController.markAsRead);
notificationRouter.delete("/deleteNotification/:notificationID", notificationController.deleteNotification);
notificationRouter.get("/filter/:userID/:opened", notificationController.filterNotifications);

module.exports = notificationRouter;