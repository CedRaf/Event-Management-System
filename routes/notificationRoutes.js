const express = require("express");
const notificationController = require("../controllers/notificationsController"); 
const authMiddleware = require("../middlewares/authenticateToken"); 

const notificationRouter = express.Router();
notificationRouter.get("/getAllNotifications/:userID", authMiddleware, notificationController.getAllNotifications);
notificationRouter.patch("/markAsRead", authMiddleware, notificationController.markAsRead);
notificationRouter.delete("/deleteNotification/:notificationID", authMiddleware, notificationController.deleteNotification);
notificationRouter.get("/filter/:userID/:opened", authMiddleware, notificationController.filterNotifications);

module.exports = notificationRouter;