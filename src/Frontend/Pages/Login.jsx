import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


// user inputs email/username and password in a useState
// Send axios.post to check if credentials match
// if true: the response will be a token plus user credentials
// if false: response is status 404 or 500


function Login(){
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try { 
      
            const {data} = await axios.post('http://localhost:3000/authenticate/login', {
                email_address: email,
                password: password
            });
            
            setEmail('');
            setPassword('');

            if(data.accessToken){//check if the token exists
                localStorage.setItem('token', data.accessToken);
                const user = {
                    userID: data.user.userID,
                    userEmail: data.user.email_address,
                    userName: data.user.username
                };
                localStorage.setItem('user', JSON.stringify(user)); //what 
                //redirect to dashboard page
                navigate('/event-category');
            }

        } catch(error){
            console.error('Error logging in:', error);
        }
        
    }

    const clientID = '865144797533-cv0hii9vdkolii1kuppfs71cklajabn0.apps.googleusercontent.com';

    const handleGoogle = async (credentialResponse) =>{
        try{

            //pass credential and client id to the body
            const body = {
                idToken: credentialResponse.credential,
                client_id: clientID
            };
            console.log(credentialResponse.credential, clientID)
            const response = await axios.post ('http://localhost:3000/authenticate/googleSignIn', body);

            const { token, user } = response.data;

            if(token){//check if the token exists
                localStorage.setItem('token', token);
                const userData = {
                    userID: user.userID,
                    userEmail: user.email_address,
                    userName: user.username
                };
                localStorage.setItem('user', JSON.stringify(userData)); //what 
                //redirect to dashboard page
                navigate('/event-category');
            }
        }catch(error){
            console.error('Error logging in with google:', error);
        }
    }

    return(
        <div className='container'>
            <div className='intro'>
                <img src="" alt="" />
                <p className='helloTxt'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, recusandae? Officiis, esse sapiente consectetur necessitatibus reprehenderit ab vitae a? Perferendis architecto odit nisi expedita quos molestias sed debitis reiciendis aspernatur.</p>
            </div>
            
            <div className='formBox'>
            <div className='noAccount'>
            <div>Do not have an account yet?</div>
            <Link to="/register">Sign up</Link>
            </div>
            <div className='loginForm'>
            <h2>Welcome back!</h2>
    
            <form onSubmit={handleSubmit}>  
               <input type="email" placeholder="Email" value= {email} onChange={(e) => {setEmail(e.target.value)}}/>
                <input type="password" placeholder="Password" value= {password} onChange={(e) => {setPassword(e.target.value)}}/>
                <a className="forgotPass" href="">Forgot Your Password?</a>
                <button type="submit">LOGIN</button>
            </form>
            <div>or continue with</div>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => {
               console.log('Login Failed');
            }}/>
      
            </div>
        </div>
        </div>

    )
}


export default Login;