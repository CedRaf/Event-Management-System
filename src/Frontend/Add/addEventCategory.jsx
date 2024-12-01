import React, { useState, useEffect } from 'react';



function AddEventCategory({createCategory, newCategory, setNewCategory}){
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        createCategory(newCategory);
    }
    
    return(
   
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Category Name" value= {newCategory.category_name} onChange={(e) => {setNewCategory({...newCategory, category_name: e.target.value})}}/>
                <input type="text" placeholder="Category Description" value= {newCategory.category_description} onChange={(e) => {setNewCategory({...newCategory, category_description: e.target.value})}}/>
                <button type="submit">Submit</button>   
            </form>
           
   
        
    )
}
export default AddEventCategory;