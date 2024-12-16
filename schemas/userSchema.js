const Joi = require("joi");

const userSchema = Joi.object({
    username: Joi.string().min(5).max(20).required().messages({
        "string.min" : "Username must be at least 5 characters long",
        "string.max" : "Username should be 20 characters or less",
        "any.required": "Please Input a Username",
    }),
    first_name: Joi.string().min(2).required().messages({
        "string.min" : "First name should be atleast 2 characters",
        "any.required": "Please input a first name",
    }),
    last_name: Joi.string().min(2).required().messages({
        "string.min" : "Last name should be atleast 2 characters",
        "any.required": "Please input a last name",
    }),
    email_address: Joi.string().email().required().messages({
        "string.email" : "Please input a valid email address",
        "any.required" : "Please input an email address",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min" : "Password should be at least 8 characters long",
        "any.required" : "Please input a valid password", 
    }),
})

module.exports = userSchema; 