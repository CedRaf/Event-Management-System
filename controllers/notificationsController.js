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
            },
            orderBy:{
                time_sent: 'desc'
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
    
    const {notificationID} = req.params;

    try{
        // const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        // const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        // if(!existingUser || !existingNotification) return

        const updatedNotification = await prisma.notifications.update({
            where:{   
                notificationID: Number(notificationID)    
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
    const{notificationID} = req.params;

    try{
        // const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        // const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        // if(!existingUser || !existingNotification) return

        const deletedNotification = await prisma.notifications.delete({
            where:{  
                notificationID: Number(notificationID)  
            }
        });

        return res.status(200).json({message:"Successfully deleted notification", deletedNotification});

    }catch(e){
        console.error("Error deleting", e.message);
        return res.status(500).json({message:"Server Error"}); 
    }
}

const filterNotifications = async(req, res) =>{

    const{userID, opened} = req.params;
    const validFields = ['true', 'false'];

    try{
        if (!validFields.includes(opened)) {
            return res.status(400).json({ message: "Invalid value for 'opened'. Use 'true' or 'false'." });
        }

        const isOpened = opened === 'true';
        const notifications = await prisma.notifications.findMany({
            where:{
                userID: Number(userID),
                opened: isOpened
            },
            orderBy:{
                time_sent: 'desc'
            }
        });

        if(notifications.length === 0){
            return res.status(400).json({message:"No notifications"});
        }

        return res.status(200).json({notifications}); 

    }catch(e){
        console.error("Error filterting Notifications", e);
        return res.status(500).json({message:"Server Error"});
    }
}

const generateRSVPNotification = async (newRSVP, senderUserID, eventID, users) => {
    try {
        const sender = await prisma.user.findUnique({
            where: {
                userID: Number(senderUserID)
            }
        });

        if (!sender) {
            throw new Error("Sender user not found.");
        }

        const notificationData = users.filter(userID => !isNaN(Number(userID))).map(userID => ({
                userID: Number(userID),  
                eventID: Number(eventID), 
                rsvpID: newRSVP.rsvpID,
                message: `You have been invited to an event by ${sender.first_name} ${sender.last_name}`,
                time_sent: new Date(),
            }));

        if (notificationData.length === 0) {
            throw new Error("No valid recipients found.");
        }

        const notifications = await prisma.notifications.createMany({
            data: notificationData,
            skipDuplicates: true
        });

        return { notifications };
    } catch (e) {
        console.error("Error generating RSVP notifications:", e);
        throw new Error(e.message); // Propagate error
    }
};

const rsvpResponseNotification = async(rsvpID, userID, response) =>{
    try{
        const rsvp = await prisma.rsvp.findUnique({
            where:{
                rsvpID: Number(rsvpID)
            }
        });

        const recipient = await prisma.user.findUnique({
            where:{
                userID: Number(userID)
            }
        });

        const eventDetails = await prisma.event.findUnique({
            where:{
                eventID: rsvp.eventID
            }
        })

        const notification = await prisma.notifications.create({
            data:{
                userID: rsvp.senderUserID,
                eventID: rsvp.eventID,
                rsvpID: Number(rsvpID),
                message: `${recipient.first_name} ${recipient.last_name} ${response} your rsvp for ${eventDetails.event_title} on ${eventDetails.event_date}`,
                time_sent: new Date()
            }
        });

        return {notification};

    }catch(e){
        console.error("Error sending rsvp response notification", e);
        throw new Error(e.message); 
    }
}

const cancelRSVPNotification = async(rsvpID, userID) =>{

    try{
        const rsvp = await prisma.rsvp.findUnique({
            where:{
                rsvpID: Number(rsvpID)
            }
        });

        const recipient = await prisma.user.findUnique({
            where:{
                userID: Number(userID)
            }
        });

        const eventDetails = await prisma.event.findUnique({
            where:{
                eventID: rsvp.eventID
            }
        });

        const notification = await prisma.notifications.create({
            data:{
                userID: rsvp.senderUserID,
                eventID: rsvp.eventID,
                rsvpID: Number(rsvpID),
                message: `${recipient.first_name} ${recipient.last_name} CANCELLED your rsvp for ${eventDetails.event_title} on ${eventDetails.event_date}`
            }
        });

        return {notification}

    }catch(e){
        console.error("Error sending rsvp cancellation notification", e);
        throw new Error(e.message); 
    }

}

module.exports = {
    getAllNotifications,
    markAsRead,
    deleteNotification,
    filterNotifications,
    generateRSVPNotification,
    rsvpResponseNotification,
    cancelRSVPNotification
}