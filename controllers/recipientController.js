const prisma = require("../prisma/database"); 
const recipientSchema = require("../schemas/recipientSchema");

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
    
        const recipient = await prisma.recipient.findUnique({
            where:{
                rsvpID_userID:{
                    rsvpID: Number(rsvpID),
                    userID: Number(userID)
                }
            }
        });
    
        if(!recipient){
            return res.status(400).json({message:"User is not a recipient of this rsvp"});
        }

        const updatedResponse = await prisma.recipient.update({
            where:{
                rsvpID_userID:{
                    rsvpID: Number(rsvpID),
                    userID: Number(userID),
                }          
            },
            data:{
                response: response
            }
        });

        return res.status(200).json({message:"Successfully updated response", updatedResponse}); 

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
    
        const recipient = await prisma.recipient.findUnique({
            where:{
                rsvpID_userID:{
                    rsvpID: Number(rsvpID),
                    userID: Number(userID)
                }
            }
        });
    
        if(!recipient){
            return res.status(400).json({message:"User is not a recipient of this rsvp"});
        }

        const cancelledRecipient = await prisma.recipient.update({
            where:{
                rsvpID_userID:{
                    rsvpID: Number(rsvpID),
                    userID: Number(userID)
                }
            },
            data:{
                cancelled: true,
                cancelled_at: new Date()
            }
        });

        return res.status(200).json({message:"Cancelled RSVP", cancelledRecipient}); 

    }catch(e){
        console.error("Error cancelling RSVP:", e);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    rsvpResponse,
    cancelRSVP
}