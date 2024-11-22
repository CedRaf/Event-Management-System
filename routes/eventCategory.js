const express = require("express");
const eventCategory = require("../controllers/eventCategory");

const eventCategoryRouter = express.Router(); 
eventCategoryRouter.post("/create", eventCategory.createCategory); 
eventCategoryRouter.get("/find/:category_name", eventCategory.findCategory);
eventCategoryRouter.get("/findAll", eventCategory.getAllCategories);
eventCategoryRouter.delete("/delete", eventCategory.deleteCategory);
eventCategoryRouter.patch("/edit/:categoryID", eventCategory.editCategory); 

module.exports = eventCategoryRouter;