const express = require("express");
const eventCategory = require("../controllers/eventCategory");
const authMiddleware = require("../middlewares/authenticateToken"); 

const eventCategoryRouter = express.Router(); 
eventCategoryRouter.post("/create", authMiddleware, eventCategory.createCategory); 
eventCategoryRouter.get("/find/:category_name", authMiddleware, eventCategory.findCategory);
eventCategoryRouter.get("/findAll", authMiddleware, eventCategory.getAllCategories);
eventCategoryRouter.delete("/delete", authMiddleware, eventCategory.deleteCategory);
eventCategoryRouter.patch("/edit/:categoryID", authMiddleware, eventCategory.editCategory); 

module.exports = eventCategoryRouter;