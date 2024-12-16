const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authenticateToken"); 

const userProfileRouter = express.Router();
userProfileRouter.get('/get/:userID', authMiddleware, userController.getUserInfo);
userProfileRouter.post('/checkPassword/:userID', authMiddleware, userController.checkPassword);
userProfileRouter.patch('/edit/:userID', authMiddleware, userController.editUserInfo);


module.exports = userProfileRouter;