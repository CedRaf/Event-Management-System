import React, { useState } from 'react';
import axios from 'axios';
import{createContext} from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
// import {RecoveryContext} import from ced




// user inputs email/username and password in a useState
// Send axios.post to check if credentials match
// if true: the response will be a token plus user credentials
// if false: response is status 404 or 500


function Login() {
    //const { setEmail, setPage } = useContext(RecoveryContext); 
    const [email, setEmailState] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); 

        try {
            const { data } = await axios.post('http://localhost:3000/authenticate/login', {
                email_address: email,
                password: password,
            });

            setEmail('');
            setPassword('');

            if (data.accessToken) {//check if the token exists
                localStorage.setItem('token', data.accessToken);
                const user = {
                    userID: data.user.userID,
                    userEmail: data.user.email_address,
                    userName: data.user.username,
                };
                localStorage.setItem('user', JSON.stringify(user)); //what 
                //redirect to dashboard page
                navigate('/event-category');
            }

        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                if (errorMessage === 'User not found') {
                    setErrors({ global: 'Email or Password is incorrect' });
                } else if (errorMessage === 'Invalid Password') {
                    setErrors({ password: 'Incorrect password, please try again' });
                } else {
                    setErrors({ global: 'Unexpected error! Please try again later.' });
                }
            } else {
                setErrors({ global: 'Network error or server unreachable!' });
            }
        }
    };

    const navigateToOTP = ()=>{
        setEmail(email);
        setPage('otp');
        navigate('/otp');
    }

    const clientID = '865144797533-cv0hii9vdkolii1kuppfs71cklajabn0.apps.googleusercontent.com';

    const handleGoogle = async (credentialResponse) => {
        try {
            const body = {
                idToken: credentialResponse.credential,
                client_id: clientID,
            };
            const response = await axios.post('http://localhost:3000/authenticate/googleSignIn', body);

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                const userData = {
                    userID: user.userID,
                    userEmail: user.email_address,
                    userName: user.username,
                };
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect to the dashboard
                navigate('/event-category');
            }
        } catch (error) {
            console.error('Error logging in with Google:', error);
            setErrors({ global: 'Google sign-in failed. Please try again.' });
        }
    };

    return (
        <div className='container'>
            <div className='intro'>
                <img src="" alt="" />
                <p className='helloTxt'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, recusandae? Officiis, esse sapiente consectetur necessitatibus reprehenderit ab vitae a? Perferendis architecto odit nisi expedita quos molestias sed debitis reiciendis aspernatur.
                </p>
            </div>

            <div className='formBox'>
                <div className='noAccount'>
                    <div>Do not have an account yet?</div>
                    <Link to="/register">Sign up</Link>
                </div>
                <div className='loginForm'>
                    <h2>Welcome back!</h2>
                    {errors.global && <div className="error-message">{errors.global}</div>}
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email"value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        {errors.password && <div className="error-message">{errors.password}</div>}
                        <Link to="#" onClick={{navigateToOTP}}>Forgot Your Password?</Link>
                        <button type="submit">LOGIN</button>
                    </form>
                    <div className='googleContainer'>
                    <div className='continueWith'>or continue with</div>
                    <GoogleLogin onSuccess={handleGoogle}onError={() => {
                            console.log('Login Failed');
                            setErrors({ global: 'Google sign-in failed. Please try again.' });
                        }}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
