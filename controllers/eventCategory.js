const prisma = require("../prisma/database");
const newCategorySchema = require("../schemas/newCategorySchema");
const editCategorySchema = require("../schemas/editCategorySchema"); 

const createCategory = async (req, res) =>{

    const {error} = newCategorySchema.validate(req.body);
    
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    const {category_name, category_description, userID} = req.body;

    try{
        const existingCategory = await prisma.eventcategory.findFirst({
            where:{
                category_name: category_name 
            }
        });

        if(existingCategory){
            return res.status(400).json({message:"Category already exists!"});
        }

        const newCategory = await prisma.eventcategory.create({
            data:{
                category_name,
                category_description,
                userID
            }
        })

        return res.status(200).json({message:"Successfully created a new category!"}); 


    }catch(e){
        console.error('Error creating new category: ', e);
        return res.status(500).json({message:"Server Error"}); 
    }
}

const deleteCategory = async (req, res) =>{
    try{
        const {category_name, userID} = req.body;
        const existingCategory = await prisma.eventcategory.findFirst({
            where:{
                userID: Number(userID),
                category_name: category_name,
            }
        });

        if(!existingCategory){
            return res.status(400).json({message:"Unable to delete category, it does not exist"}); 
        }
        const deletedCategory = await prisma.eventcategory.delete({
            where:{
                categoryID: existingCategory.categoryID
            }
        });

        return res.status(200).json({message:"Successfully deleted category: ", deletedCategory}); 

    }catch(e){
        console.error("Error deleting category: ", e);
        return res.status(500).json({message:"Server Error"});
    }
}

const editCategory = async(req, res) =>{

    const {categoryID} = req.params; 
    const {error} = editCategorySchema.validate(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message}); 
    }

    const {category_name, category_description} = req.body;

    try{
        const existingCategory = await prisma.eventcategory.findFirst({
            where:{
                categoryID: Number(categoryID)
            }
        })

        if(!existingCategory){
            return res.status(400).json({message:"Unable to delete category, it does not exist"}); 
        }

        const updatedCategory = await prisma.eventcategory.update({
            where:{
                categoryID : existingCategory.categoryID
            },
            data:{
                category_name,
                category_description,
            },
        });
        
        return res.status(200).json({message:"Successfully updated category", updatedCategory}); 

        }catch(e){
            console.error("Error updating category:", e);
            return res.status(500).json({ message: "Server error" });
        }

}

const findCategory = async (req, res) => {
    const { category_name } = req.params;
    const {userID} = req.body;

    try {
        const existingCategory = await prisma.eventcategory.findMany({
            where: {
                userID: userID,
                category_name: {
                    contains: category_name, 
                },
            },
        });

        if (existingCategory.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category Found", existingCategory });
    } catch (e) {
        console.error("Error finding category:", e);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllCategories = async(req, res) =>{

    const {userID} = req.body;
    try{
        const categoryList = await prisma.eventcategory.findMany({
            where:{
                userID: userID
            }
        });
        if(categoryList === 0){
            return res.status(400).json({message:"No categories found"});
        }
        return res.status(200).json(categoryList); 
    }catch(e){
        console.error("Error finding events:", e);
        return res.status(500).json({ message: "Server error" });
    }
}

const sortCategories = async(req, res) =>{
    const{orderBy = 'asc'} = req.params;
    const validFields = ['asc', 'desc'];
    
    if(!validFields.includes(orderBy)){
        return res.status(400).json({message:`Invalid order: ${orderBy}`});
    }

    try{
        const sortedData = await prisma.eventcategory.findMany({
            orderBy:{
                category_name: orderBy
            }
        });

        return res.status(200).json({data:sortedData}); 
    }catch(e){
        console.error("Error fetching sorted data:", e);
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    createCategory,
    deleteCategory,
    editCategory,
    findCategory,
    getAllCategories,
    sortCategories
}