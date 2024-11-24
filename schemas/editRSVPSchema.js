const Joi = require("joi");

const rsvpStatusValues = {
    ACTIVE: "ACTIVE",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED"
};
const rsvpStatusEnums = Object.values(rsvpStatusValues); 

const editRSVPSchema = Joi.object({
    eventID: Joi.number().required(),
    status: Joi.string().valid(...rsvpStatusEnums).required(),
    recipients: Joi.array().items(Joi.number().required()).min(1).max(255).required() 
});

module.exports = editRSVPSchema;