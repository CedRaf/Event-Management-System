const Joi = require("joi");

const newEventSchema = Joi.object({
    event_title: Joi.string().min(3).max(255).required().messages({
        "string.min" : "The category should be at least 3 characters",
        "string.max" : "The category should be less than 256 characters",
        "any.required" : "Please enter an event name",
    }),

    event_description: Joi.string().max(255).optional().messages({
        "string.max" : "Category descriptions should be limited to 255 characters",
    }),

    eventStart_date: Joi.date().iso().required().messages({
        "date.base" : "Input should be a valid date",
        "date.iso" : "Input should be in ISO format (YYYY-MM-DDTHH:mm:ss:sssZ)",
        "any.required" : "Please enter an event date"
    }),
    eventEnd_date: Joi.date().iso().required().messages({
        "date.base" : "Input should be a valid date",
        "date.iso" : "Input should be in ISO format (YYYY-MM-DDTHH:mm:ss:sssZ)",
        "any.required" : "Please enter an event date"
    }),
    location: Joi.string().max(255).optional().message({
        "string.max" : "The event location should be at most 255 characters",
    }),

    userID: Joi.number().required(),
    categoryID: Joi.number().optional()

});

module.exports = newEventSchema;