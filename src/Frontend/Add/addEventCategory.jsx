import React, { useState, useEffect } from 'react';



function addEventCategory({createCategory, newCategory, setNewCategory}){
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        createCategory(newCategory);
    }
    
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Event Name" value= {newCategory.category_name} onChange={(e) => {setNewCategory(e.target.value)}}/>
                <input type="text" placeholder="Event Description" value= {newCategory.category_description} onChange={(e) => {setNewCategory(e.target.value)}}/>
                <button type="submit">LOGIN</button>   
            </form>
        </div>
    )
}
export default addEventCategory;