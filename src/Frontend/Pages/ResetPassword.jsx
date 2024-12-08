import React, {useState} from 'react'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) =>{

    try{
      const response = await axios.post("http://localhost:3000/reset-password", { token: otpToken, newPassword:newPassword, });
      setMessage("Password reset successfully!");
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
