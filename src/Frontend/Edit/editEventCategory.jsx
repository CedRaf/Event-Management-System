import React, { useState, useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios';



function EditEventCategory(){
    const navigate = useNavigate();
    const location = useLocation();
    const {category} = location.state || {};
    const [token, setToken] = useState('');
    const [localCategory, setLocalCategory] = useState(category);
    const [error, setError] = useState(null);

    useEffect(() =>{

        const storedToken = localStorage.getItem('token');
        if(storedToken){
            setToken(storedToken);
        }

    }, [])

    const editCategory = async() => {
        if(!token){ //because these arent initialized right away
            return;
          }
        try{
            
            console.log( token, localCategory.category_name, localCategory.category_description);
            const response = await axios.patch(`http://localhost:3000/eventCategory/edit/${localCategory.categoryID}`,  
                {
                    category_name: localCategory.category_name,
                    category_description: localCategory.category_description 
                    //why do different axios methods have different payload format
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                } 
            );
            if(response && response.data){
                navigate("/event-category")
            }
        }catch(e){
            setError('Could not edit category. Please try again later.')
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        editCategory();
    }
    
    return(
        <div>
            <button onClick={()=> { navigate("/event-category")}}>Back</button>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Event Name" value= {localCategory.category_name} onChange={(e) => {setLocalCategory({...localCategory, category_name: e.target.value})}}/>
                <input type="text" placeholder="Event Description" value= {localCategory.category_description} onChange={(e) => {setLocalCategory({...localCategory, category_description: e.target.value})}}/>
                <button type="submit">Update</button>   
            </form>
        </div>
    )
}
export default EditEventCategory;