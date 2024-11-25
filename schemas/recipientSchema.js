const Joi = require("joi");
const rsvpResponseValues = {
    ACCEPTED: "ACCEPTED",
    DECLINED: "DECLINED"
};
const rsvpResponseEnums = Object.values(rsvpResponseValues);

const recipientSchema = Joi.object({
    response: Joi.string().valid(...rsvpResponseEnums).required(),
});

module.exports = recipientSchema;