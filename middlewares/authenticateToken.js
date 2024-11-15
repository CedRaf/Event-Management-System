require('dotenv').config();
const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers["authorization"]; 
    const token = authHeader && authHeader.split(" ")[1];
    const key = process.env.TOKEN;
    
    if(!token){
        return res.status(403).json({message: "Unauthorized Access"}); 
    }

    jwt.verify(token, key, (error, user) =>{
        if(error){
            return res.status(403).json({message: "Invalid Token"});
        }
        req.user = user;
        next(); 
    });
}

module.exports = authenticateToken; 