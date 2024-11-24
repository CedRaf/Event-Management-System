import React, { useState, useEffect } from 'react';



function EditEventCategory({editCategory, newCategory, setNewCategory}){
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        createCategory(newCategory);
    }
    
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Event Name" value= {newCategory.category_name} onChange={(e) => {setNewCategory({...newCategory, category_name: e.target.value})}}/>
                <input type="text" placeholder="Event Description" value= {newCategory.category_description} onChange={(e) => {setNewCategory({...newCategory, category_description: e.target.value})}}/>
                <button type="submit">Submit</button>   
            </form>
        </div>
    )
}
export default EditEventCategory;