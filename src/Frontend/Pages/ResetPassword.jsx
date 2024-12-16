import React, {useState} from 'react'
import { useLocation , useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../../src/OTP.css'



function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const query = new URLSearchParams(useLocation().search); // Extract the query params
  const resetToken = query.get('token');
  const navigate = useNavigate();


  const handlePasswordReset = async (e) =>{
    e.preventDefault();
    console.log(resetToken, newPassword);
    try{
      const response = await axios.patch("http://localhost:3000/authenticate/reset-password", { token: resetToken, newPassword:newPassword, });
      setMessage("Password reset successfully!");
      console.log(response);
      setTimeout(() => {
        navigate("/"); 
      }, 2000); 
    }catch (err){
      setError(err.response.data.message);
    }

  };
  return (
    <div className='main-container'>
      <div className='form-container'>
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
    </div>
  );
}

export default ResetPassword;
