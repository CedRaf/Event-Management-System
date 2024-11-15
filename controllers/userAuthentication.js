require("dotenv").config(); 
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/database");
const bcrypt = require("bcrypt"); 
const registerSchema = require("../schemas/registerSchema"); 
const loginSchema = require("../schemas/loginSchema"); 
const saltRounds = 10;


const registerNewUser = async (req, res)=>{

    const {error} = registerSchema.validate(req.body); 
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    const {username, first_name, last_name, email_address, password} = req.body;

    try{
        const existingUser = await prisma.user.findUnique({
            where: {
                email_address: email_address
            },
        });

        if(existingUser){
            return res.status(400).json({message: "Email already in use!"});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data:{
                username, 
                first_name,
                last_name,
                email_address,
                password: hashedPassword,
            }
        })

        res.status(201).json({
            message: "User registered successfully",
            user: { //delete this later, for testing purposes only
                userID: newUser.userID,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email_address: newUser.email_address,
            },
            accessToken: token,
        })

    }catch(e){
        console.error('Error registering new user', e);
        res.status(500).json({message: "Server error"}); 
    }
}

const loginAccount = async (req, res) => {
    const {error} = loginSchema.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message}); 
    }

    const {email_address, password} = req.body;
    
    try{
        const existingUser = await prisma.user.findUnique({
            where: {
                email_address: email_address,
            }
        })

        if(!existingUser){
            return res.status(404).json({message: "User not found"}); 
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid Password"}); 
        }
        
        const token = jwt.sign({userID: existingUser.userID, email_address: existingUser.email_address}, process.env.TOKEN, {expiresIn: "1h"});

        res.status(200).json({
            message:"Login Successful",
            user: {
                userID: existingUser.userID,
                username: existingUser.username,
                email_address: existingUser.email_address,
            },
            accessToken: token,
        });

    }catch(e){
        console.error("Error logging in:", e); 
        return res.status(500).json({message: "Sever error"}); 
    }
}

module.exports = {
    registerNewUser,
    loginAccount,
}

