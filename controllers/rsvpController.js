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

        await prisma.recipient.deleteMany({
            where: {
                rsvpID: existingRSVP.rsvpID,
            },
        });

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

const getRSVPRecipients = async(req, res) =>{
    
    const {rsvpID} = req.params;

    try{
        
        const recipients = await prisma.recipient.findMany({
            where:{
                rsvpID: Number(rsvpID)
            },
            select:{
                userID: true,
                user:{
                    select:{
                        first_name: true,
                        last_name: true,
                        email_address: true
                    }
                }
            }
        });

        if(recipients.length === 0){
            return res.status(400).json({message:"No recipients found for this RSVP"});
        }

        return res.status(200).json(recipients)

    }catch(e){
        console.error("Error fetching recipients:", e);
        return res.status(500).json({ message: "Server Error" });
    }
}

const getRSVPDetails = async (req, res) => {
    try {
        const { rsvpID } = req.params;

        const rsvpDetails = await prisma.rsvp.findUnique({
            where: {
                rsvpID: Number(rsvpID)
            },
            select: {
                senderUserID: true,
                sender: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email_address: true
                    }
                },
                status: true,
                eventID: true,
                event: {
                    select: {
                        event_title: true,
                        event_description: true,
                        event_date: true
                    }
                },
                recipients: {
                    select: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email_address: true
                            }
                        }
                    }
                }
            }
        });

        if (!rsvpDetails) {
            return res.status(400).json({ message: "RSVP not found" });
        }

        return res.status(200).json({ rsvpDetails });

    } catch (e) {
        console.error("Error fetching RSVP details:", e);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getUserRSVPs = async (req, res) => {
    const { userID } = req.params;
    try {
        const userRSVPs = await prisma.rsvp.findMany({
            where: {
                OR: [
                    { senderUserID: Number(userID) }, 
                    { recipients: { some: { userID: Number(userID) } } },
                ],
            },
            include: {
                event: {
                    select: {
                        event_title: true,
                        event_description: true,
                        event_date: true,
                    },
                },
                recipients: {
                    select: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email_address: true,
                            },
                        },
                    },
                },
                sender: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email_address: true,
                    },
                },
            },
        });

        if (userRSVPs.length === 0) {
            return res.status(404).json({ message: "No RSVPs associated with this user." });
        }

        return res.status(200).json({ message: "User RSVPs retrieved successfully", userRSVPs });
    } catch (e) {
        console.error("Error fetching RSVPs: ", e);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createRSVP,
    deleteRSVP,
    editRSVP,
    getRSVPRecipients,
    getRSVPDetails,
    getUserRSVPs
}
