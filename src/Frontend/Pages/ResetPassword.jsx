import React, {useState} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const query = new URLSearchParams(useLocation().search); // Extract the query params
  const resetToken = query.get('token');


  const handlePasswordReset = async (e) =>{
    e.preventDefault();
    console.log(resetToken, newPassword);
    try{
      const response = await axios.patch("http://localhost:3000/authenticate/reset-password", { token: resetToken, newPassword:newPassword, });
      setMessage("Password reset successfully!");
      console.log(response);
    }catch (err){
      setError(err.response.data.message);
    }

  };
  return (
    <div>
     <form onSubmit={handlePasswordReset}>
          <h2>Reset Password</h2>
          <div>
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required placeholder='Enter new password' />
            
          </div>
          <button type='submit'>Reset Password</button>
        </form>
        {message && <p>{message}</p>}
        {error && <div>{error}</div> } 
        </div>
  );
}

export default ResetPassword;
