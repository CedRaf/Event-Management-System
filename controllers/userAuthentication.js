require("dotenv").config(); 
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/database");
const bcrypt = require("bcrypt"); 
const registerSchema = require("../schemas/registerSchema"); 
const loginSchema = require("../schemas/loginSchema"); 
const saltRounds = 10;
const {OAuth2Client} = require('google-auth-library');

const registerNewUser = async (req, res)=>{
    console.log(req.body) //for testing purposes
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



const googleSignIn = async(req, res) =>{
    
    const {idToken, client_id} = req.body;

    if(!idToken || !client_id){
        return res.status(400).json({message:"Missing client ID or token"});
    }

    try{
        const client = new OAuth2Client(client_id); 

        const ticket = await client.verifyIdToken({
            idToken,
            requiredAudience: client_id
        });

        const payload = ticket.getPayload();
        const googleID = payload.sub;

        let user = await prisma.user.findFirst({
            where:{
                OR:[
                    {googleID: googleID},
                    {email_address: payload.email}
                ]
            }
        });

        if(!user){
            user = await prisma.user.create({
                data:{
                    googleID: googleID,
                    email_address: payload.email,
                    first_name: payload.given_name,
                    last_name: payload.family_name,
                    username: "MIKE TYSON",
                    password: null,
                }
            })
        }

        const token = jwt.sign({userID: user.userID, email: user.email_address}, process.env.TOKEN, {expiresIn: '1h'});

        return res.status(200).json({message:"Successfully signed in with Google", user, token}); 

    }catch(e){
        console.error("Error verifying Google token", e);
        return res.status(500).json({message:"Server Error"}); 
    }
}


module.exports = {
    registerNewUser,
    loginAccount,
    googleSignIn
}

