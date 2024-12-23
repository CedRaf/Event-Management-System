const prisma = require("../prisma/database");

const checkIfExistingUser = async(userID, res) =>{
    const existingUser = await prisma.user.findUnique({
        where:{
            userID: Number(userID)
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
            notificationID: Number(notificationID)
        }
    });
    if(!existingNotification){
        return res.status(400).json({message:"Notification does not exist"});
    }
    
    return existingNotification
}

const getRSVPDetails = async(rsvpID) =>{
    const rsvp = await prisma.rsvp.findUnique({
        where:{
            rsvpID: Number(rsvpID)
        }
    });

    if(!rsvp){
        throw new Error(`RSVP with ${rsvpID}, does not exist!`);
    }

    return rsvp;
}

const getUserDetails = async(userID) =>{
    const user = await prisma.user.findUnique({
        where:{
            userID: Number(userID)
        }
    });

    if(!user){
        throw new Error(`User with ${userID}, does not exist!`);
    }

    return user;
}

const getEventDetails = async(eventID) =>{
    const eventDetails = await prisma.event.findUnique({
        where:{
            eventID: Number(eventID)
        }
    });

    if(!eventDetails){
        throw new Error(`Event with ${eventID}, does not exist!`);
    }

    return eventDetails;
}

const checkIfEventHasRSVP = async(eventID) =>{

    const eventHasRSVP = await prisma.rsvp.findFirst({
        where:{
            eventID: Number(eventID)
        }
    });

    return eventHasRSVP;
}

const getRSVPRecipientIDs = async(eventID) =>{

    const rsvpRecipients = await prisma.recipient.findMany({
        where:{
            rsvp:{
                eventID: Number(eventID)
            }
        },
        select:{
            userID: true
        }
    });

    if(rsvpRecipients.length === 0){
        throw new Error(`No recipients for RSVP with event ${eventID}`);
    }

    const userIDs = rsvpRecipients.map(rsvp => rsvp.userID);

    return userIDs;
}

const checkIfCategoryNameExists = async(category_name, userID) =>{
    const existingCategory = await prisma.eventcategory.findFirst({
        where:{
            userID: Number(userID),
            category_name: category_name 
        }
    });

    return existingCategory;
}

const checkIfCategoryIDExists = async(categoryID) =>{
    const existingCategory = await prisma.eventcategory.findUnique({
        where:{
            categoryID: Number(categoryID)
        }
    });
    if(!existingCategory){
        throw new Error(`Category with ID ${categoryID} does not exist`);
    }
    
    return existingCategory;
}

const checkIfExistingRSVP = async(rsvpID) =>{
    const existingRSVP = await prisma.rsvp.findUnique({
        where:{
            rsvpID: Number(rsvpID),
        }
    });

    if(!existingRSVP){
        throw new Error(`RSVP with id ${rsvpID} does not exist`);
    }

    return existingRSVP;
}

const checkIfExistingEvent = async(eventID) =>{
    const existingEvent = await prisma.event.findUnique({
        where:{
            eventID : Number(eventID)
        }
    });

    if(!existingEvent){
        throw new Error(`Event with id ${eventID} does not exist`);
    }

    return existingEvent;
}

const convertEmailToUserID = async (recipients) => {
    
    const users = await prisma.user.findMany({
        where: {
            email_address: { in: recipients }
        },
        select: {
            userID: true, 
            email_address: true 
        }
    });

    
    const fetchedEmails = users.map(user => user.email_address);
    const invalidEmails = recipients.filter(email => !fetchedEmails.includes(email));
    
    if (invalidEmails.length > 0) {
        throw new Error(`Invalid emails: ${invalidEmails.join(", ")}`);
    }
    return users;
}

const getRecipientData = async(eventID) =>{

    const recipientData = await prisma.rsvp.findMany({
        where:{
            eventID: Number(eventID),
        },
        select:{
           recipients:{
                select:{
                    response: true,
                    user:{
                        select:{
                            first_name: true,
                            last_name: true,
                            email_address: true,
                        }
                    }
                }
           } 
        }
    });

    if(recipientData.length === 0){
        throw new Error(`No recipients found`);
    }
    return recipientData
}


module.exports = {
    checkIfExistingUser,
    checkIfExistingNotification,
    getRSVPDetails,
    getUserDetails,
    getEventDetails,
    checkIfEventHasRSVP,
    getRSVPRecipientIDs,
    checkIfCategoryNameExists,
    checkIfCategoryIDExists,
    checkIfExistingRSVP,
    checkIfExistingEvent,
    convertEmailToUserID,
    getRecipientData
}