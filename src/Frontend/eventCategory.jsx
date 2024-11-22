import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function eventCategory(){
    const [newCategory, setNewCategory] = useState({
        category_name: '',
        category_description: ''
      });
      const [findCategory, setFindCategory] = useState({
        category_name: '',
        category_description: ''
      });
    const [categories, setCategories]= useState([]);
    const [toggle, setToggle]= useState(false);
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
                const response = await axios.get('http://localhost:3000/eventCategory/findAll', user.userID); //bearer token header
                if(response){
                    setCategories(response.data)
                }
            } catch(error){
                console.error('Error retrieving categories:', error);
            }
        }
    },[token])

    const searchCategory = async(categoryName) =>{
        try{
        const response = await axios.patch('http://localhost:3000/eventCategory/${categoryName}', user.userID, {
            headers: {
               Authorization: `Bearer: ${token}`
                   }}); 
            }
        catch(error){
                console.error('Error finding category:', error);
        }
    }

    
    const createCategory = async(newCategory) =>{
        try{
            const response = await axios.post('http://localhost:3000/eventCategory/create', newCategory, {
                 headers: {
                    Authorization: `Bearer: ${token}`
                        }}); 
            if(response){
                setResponseMessage(response.data.message);
            }
        }catch(e){
            setResponseMessage('Could not register category. Please try again later.');
        }
    }

    const deleteCategory =async(categoryName)=>{
        try{
            const response = await axios.delete('http://localhost:3000/eventCategory/delete', categoryName, {
                 headers: {
                    Authorization: `Bearer: ${token}`
                        }}); 
            if(response){
                setResponseMessage(response.data.message);
            }
        }catch(e){
            setResponseMessage('Could not delete category. Please try again later.')
        }
    }



    
    return(
        <div>
            <input type="text" placeholder="Find Category" value= {findCategory.category_name} onChange={(e) => {setFindCategory(e.target.value)}}/>
            <button onClick={() => searchCategory(findCategory.category_name)}> Search </button>
            <ul>
                {categories.map((category) => (
                <li key={category.categoryID}>
                    <button>{category.category_name}</button>   <button onClick={()=> handleEdit(category.categoryID)}>EDIT</button> <button>DELETE</button> 
                </li>
                ))}
            </ul>
            <div>
                <button onClick={()=> setToggle((prevState) => !prevState)}> ADD </button>
                {isToggle && <div> 
                    <addEventCategory createCategory= {createCategory} newCategory= {newCategory} setNewCategory = {setNewCategory}/>                    
                </div>}
            </div>
        </div>
    )
}
export default eventCategory;