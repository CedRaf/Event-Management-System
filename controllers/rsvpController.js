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
        const recipientData = await helperFunc.getRecipientData(eventID);
        const notification = await notifications.generateRSVPNotification(newRSVP, senderUserID, eventID, userIDs);

        return res.status(201).json({message: "RSVP Successfully created and sent!", rsvp: newRSVP, associatedEvent, recipientData, notification});
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
        const existingRSVP = await helperFunc.checkIfExistingRSVP(rsvpID);
        const recipientData = await helperFunc.getRecipientData(eventID); 
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
            },
        })

        const notification = await notifications.editedRSVPNotification(rsvpID);

        return res.status(200).json({message:"Successfully edited RSVP", editedRSVP, recipientData, notification});

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
                        response: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email_address: true,
                    
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
        const invitations = await prisma.recipient.findMany({
            where:{
                userID: Number(userID),
            },
            select:{
                rsvpID: true,
                rsvp:{
                    select:{
                        event:{
                            select:{
                                eventID: true,
                                event_title: true,
                                eventStart_date: true,
                                eventEnd_date: true
                            }
                        },
                        sender:{
                            select:{
                                first_name: true,
                                last_name: true,
                                email_address: true,
                            }
                        }
                    }
                },
                senderUserID: true,
                response: true
            }
        });

        if(invitations.length === 0){
            return res.status(404).json({message:"RSVPs cannot be found"});
        }

        return res.status(200).json({invitations});

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
