const Joi = require("joi");

const rsvpStatusValues = {
    ACTIVE: "ACTIVE",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
};
const rsvpStatusEnums = Object.values(rsvpStatusValues);

const editRSVPSchema = Joi.object({
    eventID: Joi.number().required().messages({
        "number.base": "Event ID must be a number.",
        "any.required": "Event ID is required.",
    }),
    status: Joi.string().valid(...rsvpStatusEnums).required().messages({
            "string.base": "Status must be a string.",
            "any.only": `Status must be one of ${rsvpStatusEnums.join(", ")}.`,
            "any.required": "Status is required.",
        }),
    recipients: Joi.array().items(Joi.string().email().required()).min(1).max(255).required().messages({
            "array.base": "Recipients must be an array of email addresses.",
            "array.min": "At least one recipient email is required.",
            "array.max": "No more than 255 recipient emails can be added.",
            "string.email": "Each recipient must be a valid email address.",
            "any.required": "Recipients are required.",
        }),
});

module.exports = editRSVPSchema;
