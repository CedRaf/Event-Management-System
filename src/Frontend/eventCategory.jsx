import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function eventCategory(){
    const [newCategory, setNewCategory] = useState({
        categoryID: '',
        category_name: '',
        category_description: ''
      });
    const [categories, setCategories]= useState({})
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const navigate= useNavigate();
    
    useEffect(() =>{
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        if(parsedUser && storedToken){
            setToken(storedToken);
            setUser(parsedUser);
        }

    }, [])

    useEffect(()=>{
        const getCategories = async () => {
            try{
                const response = await axios.get('http://localhost:3000/eventCategory/findAll', user.userID);
                if(response){
                    setCategories(response.data)
                }
            } catch(error){
                console.error('Error retrieving categories:', error);
            }
        }
    },[token])

    const findCategory = async(categoryName) =>{

    }
    const createCategory = async(newCategory) =>{
        try{
            const response = await axios.post('http://localhost:3000/eventCategory/create', newCategory);
            if(response.status==)
        }
    }


    
    return(

    )
}
export default eventCategory;