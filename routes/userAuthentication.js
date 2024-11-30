const express = require("express");
const userAuth = require("../controllers/userAuthentication");

const userRouter = express.Router();
userRouter.post('/register', userAuth.registerNewUser);
userRouter.post('/login', userAuth.loginAccount); 
userRouter.post('/googleSignIn', userAuth.googleSignIn);

module.exports = userRouter; 