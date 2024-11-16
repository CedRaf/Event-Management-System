const Joi = require("joi");

const newEventSchema = Joi.object({
    category_name: Joi.string().min(3).max(255).required().messages({
        "string.min" : "The category should be at least 3 characters",
        "string.max" : "The category should be less than 256 characters",
        "any.required" : "Please enter a category name",
    }),

    category_description: Joi.string().max(255).optional().messages({
        "string.max" : "Category descriptions should be limited to 255 characters",
    })
    
});

module.exports = newEventSchema;