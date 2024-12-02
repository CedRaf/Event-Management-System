const prisma = require("../prisma/database"); 
const recipientSchema = require("../schemas/recipientSchema");
const notifications = require("../controllers/notificationsController");
const helperFunc = require("../controllers/helper_functions");

const rsvpResponse = async(req, res) =>{
    
    const{error} = recipientSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const{rsvpID, userID} = req.params;
    const {response} = req.body;

    try{
        const existingRSVP = await helperFunc.checkIfExistingRSVP(rsvpID);
    
        const recipient = await prisma.recipient.findFirst({
            where:{
                rsvpID: Number(rsvpID),
                userID: Number(userID)  
            }
        });
    
        if(!recipient){
            return res.status(400).json({message:"User is not a recipient of this rsvp"});
        }

        const updatedResponse = await prisma.recipient.update({
            where:{    
                id: recipient.id           
            },
            data:{
                response: response
            }
        });

        if(response.trim().toUpperCase() === 'ACCEPTED'){
            const eventDetails = await helperFunc.getEventDetails(existingRSVP.eventID);
            const newEvent = await prisma.event.create({
                data:{
                    event_title: eventDetails.event_title,
                    event_description: eventDetails.event_description,
                    event_date: eventDetails.event_date,
                    userID: recipient.userID,
                    categoryID: eventDetails.categoryID
                }
            })
        }

        const notification = await notifications.rsvpResponseNotification(rsvpID, userID, response);

        return res.status(200).json({message:"Successfully updated response", updatedResponse, notification}); 

    }catch(e){
        console.error("Error updating RSVP response:", e);
        return res.status(500).json({ message: "Server error" });
    }
}

const cancelRSVP = async(req, res) =>{
    const{rsvpID, userID} = req.params;
    try{
        await helperFunc.checkIfExistingRSVP(rsvpID);
    
        const recipient = await prisma.recipient.findFirst({
            where:{
                    rsvpID: Number(rsvpID),
                    userID: Number(userID)
            }
        });
    
        if(!recipient){
            return res.status(400).json({message:"User is not a recipient of this rsvp"});
        }

        const cancelledRecipient = await prisma.recipient.update({
            where:{
                id: recipient.id
            },
            data:{
                response: "DECLINED",
                cancelled: true,
                cancelled_at: new Date()
            }
        });

        const notification = await notifications.cancelRSVPNotification(rsvpID, userID);

        return res.status(200).json({message:"Cancelled RSVP", cancelledRecipient, notification}); 

    }catch(e){
        console.error("Error cancelling RSVP:", e);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    rsvpResponse,
    cancelRSVP
}