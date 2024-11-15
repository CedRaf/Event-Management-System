import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register(){
    const [newUser, setNewUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email_address: '',
        password: '',
      });
    const navigate= useNavigate();

    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setNewEmployee({ ...newEmployee, [name]: value });
    // };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try { 
            const {data} = await axios.post('http://localhost:3000/register', newUser);
            setNewEmployee({
                username: '',
                first_name: '',
                last_name: '',
                email_address: '',
                password: ''
            });
            if(data && data.message){
                navigate('/login');
            }    

        } catch(error){
            console.error('Error registering new user', error);
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value= {newUser.username} onChange={(e) => {setNewUser({...newUser, username: e.target.value}) }}/>
                <input type="text" placeholder="first_name" value= {newUser.first_name} onChange={(e) => {setNewUser({...newUser, first_name: e.target.value}) }}/>
                <input type="text" placeholder="last_name" value= {newUser.last_name} onChange={(e) => {setNewUser({...newUser, last_name: e.target.value}) }}/>
                <input type="text" placeholder="email_address" value= {newUser.email_address} onChange={(e) => {setNewUser({...newUser, email_address: e.target.value}) }}/>
                <input type="text" placeholder="password" value= {newUser.password} onChange={(e) => {setNewUser({...newUser, password: e.target.value}) }}/>
                
                <button type={submit}/>   
            </form>
        </div>
    )
}