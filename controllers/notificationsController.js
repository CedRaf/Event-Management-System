const prisma = require("../prisma/database");
const helperFunc = require("./helper_functions");

const getAllNotifications = async(req, res) =>{

    const {userID} = req.params;

    try{
        const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        if(!existingUser) return
        
        const allNotifications = await prisma.notifications.findMany({
            where: {
                userID: Number(userID)
            }
        });

        if(allNotifications === 0){
            return res.status(400).json({message:"No Notifications Found"}); 
        }

        return res.status(200).json({allNotifications}); 

    }catch(e){
        console.error("Error finding notfications", e);
        return res.status(500).json({message:"Server Error"}); 
    }
}

const markAsRead = async(req, res) =>{
    
    const {userID, notificationID} = req.params;

    try{
        const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        if(!existingUser || !existingNotification) return

        const updatedNotification = await prisma.notifications.update({
            where:{
                userID_notificationID:{
                    userID: Number(userID),
                    notificationID: Number(notificationID)
                }
            },
            data:{
                opened: true
            }
        });

        return res.status(200).json({message:"Marked as read", updatedNotification});

    }catch(e){
        console.error("Error updating notfications", e);
        return res.status(500).json({message:"Server Error"}); 
    }
}

const deleteNotification = async(req, res) =>{
    const{userID, notificationID} = req.params;

    try{
        const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        if(!existingUser || !existingNotification) return

        const deletedNotification = await prisma.notifications.delete({
            where:{
                userID_notificationID:{
                    userID: Number(userID),
                    notificationID: Number(notificationID)
                }
            }
        });

        return res.status(200).json({message:"Successfully deleted notification", deletedNotification});

    }catch(e){
        console.error("Error deleting", e.message);
        return res.status(500).json({message:"Server Error"}); 
    }
}

module.exports = {
    getAllNotifications,
    markAsRead,
    deleteNotification
}