const express = require("express");
const eventCategory = require("../controllers/eventCategory");

const eventCategoryRouter = express.Router(); 
eventCategoryRouter.post("/create", eventCategory.createCategory); 
eventCategoryRouter.get("/find", eventCategory.findCategory);
eventCategoryRouter.delete("/delete", eventCategory.deleteCategory);
eventCategoryRouter.patch("/edit", eventCategory.editCategory); 

module.exports = eventCategoryRouter;