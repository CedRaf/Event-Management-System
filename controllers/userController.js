const prisma = require("../prisma/database");
const helperFunc = require("../controllers/helper_functions");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt"); 

const getUserInfo = async(req, res) =>{
    const {userID} = req.params;
    try{
        const userInformation = await helperFunc.getUserDetails(userID);
        return res.status(200).json({message:"User found", userInformation});

    }catch(e){
        console.error('Error retrieving user information', e);
        return res.status(404).json({message:"User details not found"}); 
    }
}

const checkPassword = async(req, res) =>{
    const {userID} = req.params;
    const {password} = req.body;
    try{
        const existingUser = await helperFunc.getUserDetails(userID); 
        const validPassword =  bcrypt.compare(password, existingUser.password);
        if(!validPassword){
            return res.status(400).json({message: "Invalid Password"}); 
        }

        return res.status(200).json({message:"Valid password", existingUser});

    }catch(e){
        console.error('Error checking password', e);
        return res.status(400).json({message:"Error validating password"});
    }
}

const editUserInfo = async(req,res) =>{
    const {error} = userSchema.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    const {userID} = req.params;
    const {username, first_name, last_name, email_address, password} = req.body;

    try{
        const existingUser = await helperFunc.getUserDetails(userID);
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUserDetails = await prisma.user.update({
            where:{
                userID: Number(existingUser.userID) 
            },
            data:{
                username,
                first_name, 
                last_name,
                email_address,
                password: hashedPassword
            }
        });

        return res.status(200).json({message:"Successfully updated user details", newUserDetails});

    }catch(e){
        console.error('Error updating user information', e);
        return res.status(400).json({message:"Unable to edit user information"}); 
    }

}


module.exports ={
    getUserInfo,
    checkPassword,
    editUserInfo
}