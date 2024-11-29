const prisma = require("../prisma/database"); 
const recipientSchema = require("../schemas/recipientSchema");
const notifications = require("../controllers/notificationsController");

const rsvpResponse = async(req, res) =>{
    
    const{error} = recipientSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const{rsvpID, userID} = req.params;
    const {response} = req.body;

    try{
        const existingRSVP = await prisma.rsvp.findUnique({
            where:{
                rsvpID: Number(rsvpID)
            }
        });
    
        if(!existingRSVP){
            return res.status(400).json({message:"RSVP does not exist"});
        }
    
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
        const existingRSVP = await prisma.rsvp.findUnique({
            where:{
                rsvpID: Number(rsvpID)
            }
        });
    
        if(!existingRSVP){
            return res.status(400).json({message:"RSVP does not exist"});
        }
    
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