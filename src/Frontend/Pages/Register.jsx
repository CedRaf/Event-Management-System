import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Register(){
    const [newUser, setNewUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email_address: '',
        password: '',
      });
    const [errors, setErrors] = useState({});
    const navigate= useNavigate();

    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setNewEmployee({ ...newEmployee, [name]: value });
    // };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try { 
            const {data} = await axios.post('http://localhost:3000/authenticate/register', newUser);
            setNewUser({
                username: '',
                first_name: '',
                last_name: '',
                email_address: '',
                password: ''
            });
            if(data && data.message){
                navigate('/');
            }    

        } catch(error){
            if (error.response && error.response.data.message) {
                const errorMessage = error.response.data.message;
                
                if (errorMessage.includes("Username")) {
                    setErrors({ username: errorMessage });
                  } else if (errorMessage.includes("First name")) {
                    setErrors({ first_name: errorMessage });
                  } else if (errorMessage.includes("Last name")) {
                    setErrors({ last_name: errorMessage });
                  } else if (errorMessage.includes("email")) {
                    setErrors({ email_address: errorMessage });
                  } else if (errorMessage.includes("Password")) {
                    setErrors({ password: errorMessage }); 
                  } else {
                    setErrors({ duplicate: 'User already exists!' });
                  }
            }else{
                setErrors({ global: 'Unexpected error!' });
            }
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
                        <div>Aleady have an account?</div>
                        
                        <Link to="/">Login</Link>
                    </div>
                    <div className='regForm'>
                        <h2>Join Us!</h2>
                        {errors.global && <div className="reg-error-message">{errors.global}</div>}
       
            <form onSubmit={handleSubmit}>
                <div>
                <input type="text" placeholder="Username" value= {newUser.username} onChange={(e) => {setNewUser({...newUser, username: e.target.value}) }}/>
                {errors.username && <div className="reg-error-message">{errors.username}</div>}
                </div>


                <div>
                <input type="text" placeholder="First name" value= {newUser.first_name} onChange={(e) => {setNewUser({...newUser, first_name: e.target.value}) }}/>
                {errors.first_name && <div className="reg-error-message">{errors.first_name}</div>}
                </div>

                <div>
                <input type="text" placeholder="Last name" value= {newUser.last_name} onChange={(e) => {setNewUser({...newUser, last_name: e.target.value}) }}/>
                {errors.last_name && <div className="reg-error-message">{errors.last_name}</div>}
                </div>

                <div>
                <input type="email" placeholder="Email" value= {newUser.email_address} onChange={(e) => {setNewUser({...newUser, email_address: e.target.value}) }}/>
                {errors.email_address && <div className="reg-error-message">{errors.email_address}</div>}
                {errors.duplicate && <div className="reg-error-message">{errors.duplicate}</div>}   
                </div>

                <div>
                <input type="password" placeholder="Password" value= {newUser.password} onChange={(e) => {setNewUser({...newUser, password: e.target.value}) }}/>
                {errors.password && <div className="reg-error-message">{errors.password}</div>}
                </div>

                <button type="submit">REGISTER</button>   
            </form>
            </div>
        </div>
        </div>
    )
}
export default Register;