const Joi = require("joi");

const loginSchema = Joi.object({
    email_address: Joi.string().email().required(),
    password: Joi.string().min(8).required(), 
});

module.exports = loginSchema;