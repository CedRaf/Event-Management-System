const prisma = require("../prisma/database");

const checkIfExistingUser = async(userID, res) =>{
    const existingUser = await prisma.user.findUnique({
        where:{
            userID: userID
        }
    });

    if(!existingUser){
        return res.status(400).json({message:"User does not exist"});
    }

    return existingUser 
}

const checkIfExistingNotification = async(notificationID, res) =>{
    const existingNotification = await prisma.notifications.findUnique({
        where:{
            notificationID: notificationID
        }
    });
    if(!existingNotification){
        return res.status(400).json({message:"Notification does not exist"});
    }
    
    return existingNotification
}

module.exports = {
    checkIfExistingUser,
    checkIfExistingNotification
}