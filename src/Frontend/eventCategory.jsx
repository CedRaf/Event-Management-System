import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddEventCategory from './Add/addEventCategory';
// import editEventCategory from './Edit/editEventCategory';


function EventCategory(){
    const [newCategory, setNewCategory] = useState({
        userID: '',
        category_name: '',
        category_description: ''
      });
      const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories]= useState([]);
    const [addtoggle, setAddToggle]= useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [filteredCategories, setFilteredCategories]= useState([]);
    const [editToggle, setEditToggle] = useState(false);
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
            if(!token && !user){ //because these arent initialized right away
                return;
            }
            try{
                console.log(user, token);
                const response = await axios.get(`http://localhost:3000/eventCategory/findAll`,  {
                    headers: {
                       Authorization: `Bearer: ${token}`
                           },
                    data: {
                        userID: user.userID
                    } }); 
                    
                if(response){
                    setCategories(response.data)
                    setFilteredCategories(response.data)
                }
            } catch(error){
                console.error('Error retrieving categories:', error);
            }
        }
        getCategories();
    },[token, user])

    const searchCategory = (searchTerm) =>{
        if(searchTerm){
        const results = categories.filter((category) =>
            category.category_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) // Case-insensitive search
        );
            setFilteredCategories(results);
        }
        else{
            setFilteredCategories(categories);
        }
       
    }

    
    const createCategory = async(newCategory) =>{
        setNewCategory(prev => ({
            ...prev, // Preserve existing fields
            userID: user.userID, // Set the userID
        }));

        try{
            console.log(newCategory);
            const response = await axios.post(`http://localhost:3000/eventCategory/create`, newCategory, {
                 headers: {
                    Authorization: `Bearer: ${token}`
                        }}); 
            if(response){
                setResponseMessage(response.data.message);
                window.location.reload();
            }
        }catch(e){
            setResponseMessage('Could not register category. Please try again later.');
        }
    }

    const deleteCategory =async(category_name)=>{
        const PAYLOAD = {category_name: category_name, userID: user.userID};
        try{

            const response = await axios.delete(`http://localhost:3000/eventCategory/delete`, {
                 headers: {
                    Authorization: `Bearer: ${token}`
                 },
                 data: {
                    category_name: category_name,
                    userID: user.userID
                 }}); 
                 window.location.reload();
            if(response){
                setResponseMessage("TUBOL ITLOG");
                
            }
        }catch(e){
            setResponseMessage('Could not delete category. Please try again later.')
        }
    }

    const editCategory = async(categoryID) =>{

    }



    
    return(
        <div>
            <input type="text" placeholder="Find Category" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchCategory(searchTerm)}> Search </button>
            <ul>
                {filteredCategories.map((category) => (
                <li key={category.categoryID}>
                        <button>{category.category_name}</button>  
                        <button onClick={()=> setEditToggle((prevState) => !prevState)}>EDIT</button>  
                        {editToggle && <div> 
                            <EditEventCategory editCategory= {editCategory} newCategory= {newCategory} setNewCategory = {setNewCategory}/>                    
                        </div>}
                        <button onClick={()=> deleteCategory(category.category_name)}>DELETE</button> 
                </li>
                ))}
            </ul>
            <div>
                <button onClick={()=> setAddToggle((prevState) => !prevState)}> ADD </button>
                {addtoggle && <div> 
                    <AddEventCategory createCategory= {createCategory} newCategory= {newCategory} setNewCategory = {setNewCategory}/>                    
                </div>}
            </div>
        </div>
    )
}
export default EventCategory;