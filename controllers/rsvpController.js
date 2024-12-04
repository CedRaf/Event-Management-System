const prisma = require("../prisma/database");
const rsvpController = require("../schemas/createRSVPSchema");
const editRSVPController = require("../schemas/editRSVPSchema");
const notifications = require("../controllers/notificationsController");
const helperFunc = require("../controllers/helper_functions");

const createRSVP = async (req, res) => {
    const { error } = rsvpController.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { senderUserID, eventID, recipients } = req.body;
    console.log(req.body)
    try {
        const users = await helperFunc.convertEmailToUserID(recipients);

        const userIDs = users.map(user => user.userID);

        const existingRSVP = await helperFunc.checkIfEventHasRSVP(eventID);  
        if(existingRSVP){
            return res.status(400).json({message:"Failed to create RSVP for this event, already exists"}); 
        }

        const newRSVP = await prisma.rsvp.create({
            data: {
                senderUserID,
                eventID,
                recipients: {
                    create: users.map(user => ({
                        userID: user.userID
                    }))
                }
            }
        });

        const associatedEvent = await helperFunc.checkIfExistingEvent(eventID);

        const notification = await notifications.generateRSVPNotification(newRSVP, senderUserID, eventID, userIDs);

        return res.status(201).json({message: "RSVP Successfully created and sent!", rsvp: newRSVP, associatedEvent, notification});
    } catch (e) {
        console.error("Error creating new RSVP: ", e);
        return res.status(500).json({ message: "Server Error" });
    }
};

const deleteRSVP = async (req,res) =>{

    const {rsvpID} = req.body;
    const existingRSVP = await helperFunc.checkIfExistingRSVP(rsvpID);

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
    // const {error} = editRSVPController.validate(req.body);
    // if(error){
    //     return res.status(400).json({message: error.details[0].message});
    // }

    const {eventID, status, recipients} = req.body;

    try{
        const existingRSVP = await helperFunc.checkIfExistingRSVP(Number(rsvpID));

        await prisma.recipient.deleteMany({
            where: {
                rsvpID: existingRSVP.rsvpID,
            },
        });

        const users = await helperFunc.convertEmailToUserID(recipients);

        const editedRSVP = await prisma.rsvp.update({
            where:{
                rsvpID: existingRSVP.rsvpID
            },
            data:{
                eventID,
                status,
                last_edited: new Date(),
                recipients : {
                    create: users.map(user => ({
                        userID: user.userID
                    }))
                }
            }
        })

        const notification = await notifications.editedRSVPNotification(rsvpID);

        return res.status(200).json({message:"Successfully edited RSVP", editedRSVP, notification});

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
        const { eventID } = req.params;

        const rsvpDetails = await prisma.rsvp.findFirst({
            where: {
                eventID: Number(eventID)
            },
            select: {
                rsvpID: true,
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
                        eventStart_date: true,
                        eventEnd_date: true,
                        location: true
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
                        location: true,
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
