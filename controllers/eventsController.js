const prisma = require("../prisma/database");
const newEventSchema = require("../schemas/newEventSchema"); 

const createEvent = async (req, res) =>{

    const {error} = newEventSchema.validate(req.body); 

    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    const {event_title, event_description, event_date, userID, categoryID} = req.body;

    try{
        if(event_date && new Date(event_date) < new Date()){
            return res.status(400).json({message:"Inputted date was in the past, please enter a valid date"}); 
        }

        const newEvent = await prisma.event.create({
            data:{
                event_title,
                event_description,
                event_date: event_date ? new Date(event_date) : undefined,
                userID,
                categoryID
            }
        });
        return res.status(200).json({message:"Event successfully created", newEvent});

    }catch(e){
        console.error('Error creating new event: ', e);
        return res.status(500).json({message:"Server Error"}); 
    }

};

const deleteEvent = async(req, res) =>{

    try{
        const{eventID} = req.body;
        const existingEvent = await prisma.event.findUnique({
            where:{
                eventID : eventID
            }
        });

        if(!existingEvent){
            return res.status(400).json({message:"Error, event does not exist!"});
        }

        const deletedEvent = await prisma.event.delete({
            where:{
                eventID: existingEvent.eventID
            }
        });

        return res.status(200).json({message:"Event successfully deleted!"}); 

    }catch(e){
        console.error("Error deleting event: ", e);
        return res.status(500).json({message:"Server Error"});
    }
}

const editEvent = async(req, res) =>{
    const {eventID} = req.params; 
    const {error} = newEventSchema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message}); 
    }
    const {event_title, event_description, event_date, userID, categoryID} = req.body;

    try{
        const existingEvent = await prisma.event.findUnique({
            where:{
                eventID: Number(eventID)
            }
        })

        if(!existingEvent){
            return res.status(400).json({message:"Error updating, event does not exist!"});
        }

        const updatedEvent = await prisma.event.update({
            where:{
                eventID: existingEvent.eventID
            },
            data:{
                event_title,
                event_description,
                event_date: event_date ? new Date(event_date) : undefined,
                userID,
                categoryID
            }
        })
        return res.status(200).json({message:"Successfully edited event", updatedEvent}); 
    }catch(e){
        console.error("Error updating event:", e);
        return res.status(500).json({ message: "Server error" });
    }
}

const findEvent = async(req, res) =>{

    const{event_title} = req.params;
    try{
        const existingEvent = await prisma.event.findMany({
            where:{
                event_title:{
                    contains: event_title
                } 
            }
        })

        if(existingEvent.length === 0){
            return res.status(400).json({message:"Event not found"});
        }

        return res.status(200).json({message:"Event/s Found", existingEvent}); 

    }catch(e){
        console.error("Error finding event:", e);
        return res.status(500).json({ message: "Server error" });
    }

}

const getAllEvents = async(req, res) =>{

    try{
        const eventList = await prisma.event.findMany();
        if(eventList === 0){
            return res.status(400).json({message:"No events found"});
        }

        return res.status(200).json(eventList); 

    }catch(e){
        console.error("Error finding events:", e);
        return res.status(500).json({ message: "Server error" });
    }

}

module.exports = {
    createEvent,
    deleteEvent,
    editEvent,
    findEvent,
    getAllEvents
}