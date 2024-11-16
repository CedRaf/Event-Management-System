const express = require("express");
const userAuth = require("../controllers/userAuthentication");

const userRouter = express.Router();
userRouter.post('/register', userAuth.registerNewUser);
userRouter.post('/login', userAuth.loginAccount); 

module.exports = userRouter; 