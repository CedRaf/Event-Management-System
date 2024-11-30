import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddEventCategory from '../Add/AddEventCategory.jsx';


//import getByCategoryAPI from '../components/EventAPI.jsx'


function EventCategory(){
    const [newCategory, setNewCategory] = useState({
        userID: '',
        category_name: '',
        category_description: ''
      });
      const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories]= useState([]);
    const [addtoggle, setAddToggle]= useState(false);
    const [editedCategory, setEditedCategory] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');
    const [error, setError] = useState(null);
    const [filteredCategories, setFilteredCategories]= useState([]);

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
                const response = await axios.get(`http://localhost:3000/eventCategory/findAll/${user.userID}`,  {
                    headers: {
                       Authorization: `Bearer ${token}`
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
            setCategories(results);
        }
        else{
            setCategories(categories);
        }
       
    }

    
    const createCategory = async(newCategory) =>{
        //category_name, category_description, userID body
        //returns newCategory
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
            if(response && response.date.newCategory){
                setCategories((prevCategories) => [...prevCategories, response.data.newCategory]);
                
            }
        }catch(e){
            setError('Could not register category. Please try again later.');
        }
    }

    const deleteCategory =async(category_name)=>{
        //category_name, userID body
        //returns deletedCategory
        try{

            const response = await axios.delete(`http://localhost:3000/eventCategory/delete`, {
                 headers: {
                    Authorization: `Bearer: ${token}`
                 },
                 data: {
                    category_name: category_name,
                    userID: user.userID
                 }}); 
                 if(response && response.data){
                    setCategories((prevCategories) => prevCategories.filter((category) => category.categoryID !== response.data.deletedCategory.categoryID));
    
                 }
        }catch(e){
            setError('Could not delete category. Please try again later.')
        }
    }

    const editCategory = async(categoryID) =>{
        //categoryID params, category_name, category_description body
        //returns updatedCategory
    }




    
    return(
        <div>
            <input type="text" placeholder="Find Category" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchCategory(searchTerm)}> Search </button>
            <ul>
                {categories.map((category) => (
                <li key={category.categoryID}>
                        <button>{category.category_name}</button>  
                        <button onClick={()=> { 
                            setEditedCategory(category);
                            navigate("/EditEventCategory", { 
                                state: { 
                                  category                                
                                } 
                            });
                        }}>EDIT</button>  
                        {/* {editToggle && <div> 
                            <EditEventCategory editCategory= {editCategory} newCategory= {newCategory} setNewCategory = {setNewCategory}/>                    
                        </div>} */}
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