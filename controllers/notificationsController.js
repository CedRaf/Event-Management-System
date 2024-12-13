const prisma = require("../prisma/database");
const helperFunc = require("./helper_functions");

const getAllNotifications = async(req, res) =>{

    const {userID} = req.params;

    try{
        const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        if(!existingUser) return
         
        const allNotifications = await prisma.notifications.findMany({
            where: {
                userID: Number(userID),
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
        const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        if(!existingNotification) return

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
        const existingNotification =  await helperFunc.checkIfExistingNotification(notificationID, res);
        if(!existingNotification) return

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
        const existingUser = await helperFunc.checkIfExistingUser(userID, res);
        if(!existingUser) return

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
        const sender = await helperFunc.getUserDetails(senderUserID);
    
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
        throw new Error(e.message);
    }
};

const rsvpResponseNotification = async(rsvpID, userID, response) =>{
    try{
        const rsvp = await helperFunc.getRSVPDetails(rsvpID);

        const recipient = await helperFunc.getUserDetails(userID);

        const eventDetails = await helperFunc.getEventDetails(rsvp.eventID);

        const notification = await prisma.notifications.create({
            data:{
                userID: rsvp.senderUserID,
                eventID: rsvp.eventID,
                rsvpID: Number(rsvpID),
                message: `${recipient.first_name} ${recipient.last_name} ${response} your rsvp for ${eventDetails.event_title} on ${eventDetails.eventStart_date}`,
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
        const rsvp = await helperFunc.getRSVPDetails(rsvpID);

        const recipient = await helperFunc.getUserDetails(userID);

        const eventDetails = await helperFunc.getEventDetails(rsvp.eventID);

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

const editedEventNotification = async(eventID) =>{

    try{
        const eventHasRSVP = await helperFunc.checkIfEventHasRSVP(eventID);
        if(!eventHasRSVP) return

        const sender = await helperFunc.getUserDetails(eventHasRSVP.senderUserID);

        const eventDetails = await helperFunc.getEventDetails(rsvp.eventID);

        const userIDs = await helperFunc.getRSVPRecipientIDs(eventID);

        const notification = await prisma.notifications.createMany({
            data: userIDs.map(userID=>({
                userID: userID,
                eventID: eventID,
                message: `Details for event "${eventDetails.event_title}" has been edited by ${sender.first_name} ${sender.last_name}`,
                time_sent: new Date()
            }))
        });

        return {notification}
    }catch(e){
        console.error("Error generating notifications for edited event");
        throw new Error(e.message);
    }
}

const editedRSVPNotification = async(rsvpID) =>{
    try{
        const rsvpDetails = await helperFunc.getRSVPDetails(rsvpID); 
        const sender = await helperFunc.getUserDetails(rsvpDetails.senderUserID);
        const eventDetails = await helperFunc.getEventDetails(rsvpDetails.eventID);
        const userIDs = await helperFunc.getRSVPRecipientIDs(rsvpDetails.eventID);
        const notification = await prisma.notifications.createMany({
            data: userIDs.map(userID=>({
                userID: userID,
                rsvpID: Number(rsvpID),
                message: `RSVP details for event "${eventDetails.event_title}" has been edited by ${sender.first_name} ${sender.last_name}`,
                time_sent: new Date()
            }))
        });

        return {notification}

    }catch(e){
        console.error("Error generating notifications for edited RSVP");
        throw new Error(e.message);
    }
}

const deletedEventWithRSVP = async(rsvpID, deletedEvent) =>{
    try{
        const rsvpDetails = await helperFunc.getRSVPDetails(rsvpID);
        const sender = await helperFunc.getUserDetails(rsvpDetails.senderUserID);
        const userIDs = await helperFunc.getRSVPRecipientIDs(rsvpDetails.eventID);
        const notification = await prisma.notifications.createMany({
            data: userIDs.map(userID =>({
                userID: userID,
                rsvpID: Number(rsvpID),
                message: `${sender.first_name} ${sender.last_name} has deleted event ${deletedEvent.event_title} thus cancelling the RSVP`,
                time_sent: new Date()
            }))
        });

        return {notification}

    }catch(e){
        console.error("Error generating notification for deleted event");
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
    cancelRSVPNotification,
    editedEventNotification,
    editedRSVPNotification,
    deletedEventWithRSVP
}