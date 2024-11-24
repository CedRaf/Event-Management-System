const prisma = require("../prisma/database");
const rsvpController = require("../schemas/createRSVPSchema");
const editRSVPController = require("../schemas/editRSVPSchema");

const createRSVP = async(req, res) =>{

    const {error} = rsvpController.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    const {senderUserID, eventID, recipients} = req.body;

    try{
        const newRSVP = await prisma.rsvp.create({
            data:{
                senderUserID,
                eventID,
                recipients : {
                    create: recipients.map(userID => ({
                        userID,
                    }))
                }
            }
        })

        const associatedEvent = await prisma.event.findUnique({
            where:{
                eventID: eventID,
            }
        })

        return res.status(201).json({message:"RSVP Successfully created and sent!", rsvp:newRSVP, associatedEvent});

    }catch(e){
        console.error('Error creating new RSVP: ', e);
        return res.status(500).json({message:"Server Error"});
    }
}

const deleteRSVP = async (req,res) =>{

    const {rsvpID} = req.body;
    const existingRSVP = await prisma.rsvp.findUnique({
        where:{
            rsvpID: Number(rsvpID),
        }
    });
    if(!existingRSVP){
        return res.status(400).json({message:"RSVP does not exist"});
    }

    try{
        const deletedRSVP = await prisma.rsvp.delete({
            where:{
                rsvpID: existingRSVP.rsvpID,
            }
        });
        
        return res.status(200).json({message:"Successfully deleted rsvp", deletedRSVP}); 

    }catch(e){
        console.error("Error deleting rsvp: ", e);
        return res.status(500).json({message:"Server Error"});
    }
}

const editRSVP = async (req, res) =>{

    const {rsvpID} = req.params;
    const {error} = editRSVPController.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    const {eventID, status, recipients} = req.body;

    try{
        const existingRSVP = await prisma.rsvp.findUnique({
            where:{
                rsvpID: Number(rsvpID),
            }
        });
    
        if(!existingRSVP){
            return res.status(400).json({message:"RSVP does not exist"});
        }

        const editedRSVP = await prisma.rsvp.update({
            where:{
                rsvpID: existingRSVP.rsvpID
            },
            data:{
                eventID,
                status,
                last_edited: new Date(),
                recipients : {
                    create: recipients.map(userID => ({
                        userID,
                    }))
                }
            }
        })

        return res.status(200).json({message:"Successfully edited RSVP", editedRSVP});

    }catch(e){
        console.error("Error editing rsvp: ", e);
        return res.status(500).json({message:"Server Error"});
    }
}

module.exports = {
    createRSVP,
    deleteRSVP,
    editRSVP
}
