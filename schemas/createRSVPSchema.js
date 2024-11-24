const Joi = require("joi");

const createRSVPSchema = Joi.object({
    senderUserID: Joi.number().required(),
    eventID: Joi.number().required(),
    recipients: Joi.array().items(Joi.number().required()).min(1).max(255).required() 
});

module.exports = createRSVPSchema;