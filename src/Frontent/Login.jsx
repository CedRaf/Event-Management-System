import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// user inputs email/username and password in a useState
// Send axios.post to check if credentials match
// if true: the response will be a token plus user credentials
// if false: response is status 404 or 500


function Login(){
    const [username, setUsername]= useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try { 
            const {data} = await axios.post('http://localhost:3000/login', {
                email: userName,
                password: password
            });
        
            if(data.accessToken){//check if the token exists
                localStorage.setItem('token', data.accessToken);
                const user = {
                    userID: data.user.userID,
                    userEmail: data.user.email_address,
                    userName: data.user.username
                };
                localStorage.setItem('user', JSON.stringify(user)); //what 
                //redirect to dashboard page
                navigate('/dashboard');
            }

        } catch(error){
            console.error('Error logging in:', error);
        }
        
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username or Email" value= {username} onChange={(e) => {setUsername(e.target.value)}}/>
                <input type="text" placeholder="Password" value= {password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button type={submit}/>   
            </form>
        </div>

    )
}


export default Login;