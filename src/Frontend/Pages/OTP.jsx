import React, {useState} from 'react'
import axios from 'axios';
import '../../../src/OTP.css'


function OTP({onOtpSent}){

  const [email, setEmail] = useState("");  

  const handleEmailSubmit = async (e) =>{

    try {
      const response = await axios.post("http://localhost:3000/authenticate/forgot-password", { email_address: email });
      setMessage(response.data.message || "OTP sent to your email.");
      onOtpSent?.();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while sending the email.");
    }
  };
  

  return(
    <div className='main-container'>
      <div className="form-container">
        <form onSubmit={handleEmailSubmit}>
          <h2>Request Password Reset Link</h2>
          <div>
            <label>Valid Email Address:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email"/>
          </div>
          <button type="submit">Send Link</button>

          <div className="message">Don't see the email yet?</div>
          <button type="submit" className="secondary-button">Resend Link</button>
        </form>
      </div>
    </div>
  )
} 

export default OTP