import React, {useState, useEffect} from 'react'
import axios from 'axios';



function Profile(){

    const [user, setUser] = useState('');
    const [token, setToken] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [existingUser, setExistingUser] = useState('');
    const [updatedUser, setUpdatedUser] = useState('');
    const [askPassword, setAskPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError]= useState('');

    useEffect(() =>{
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const parsedUser = JSON.parse(storedUser);
      if(parsedUser && storedToken){
          setToken(storedToken);
          setUser(parsedUser);
      }
  
  }, [])

    useEffect(() => {
      const getUserInfo = async () => {
        if(!token && !user){ //because these arent initialized right away
          return;
        }
        
        try {
          
          const response = await axios.get(`http://localhost:3000/userProfile/get/${user.userID}`, {
            headers: {
              Authorization: `Bearer: ${token}`
                }});
          if(response){ 
            const { username, first_name, last_name, email_address } = response.data.userInformation;
            setUserInfo(response.data.userInformation);
            setUpdatedUser({ username, first_name, last_name, email_address });
       
          }
          
        } catch (err) {
          setError('Error fetching the Event');
        }
      };
  
      getUserInfo();
    }, [token, user]);


    //Display current user info, button for edit information 
    //prompt for current password call checkPassword , popup format
    //if receive existingUser in response allow  user to edit 
    const checkPassword = async () =>{
      console.log(token);
      try {
          
        const response = await axios.post(`http://localhost:3000/userProfile/checkPassword/${user.userID}`, {
          password: password
        },{
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response && response.data){ 
          setExistingUser(response.data.existingUser);
          console.log(existingUser);
        }
        
      } catch (err) {
        setError('Error checking password', err);
      }
    }


    const editUserInfo = async (e) =>  {
      e.preventDefault();
        console.log(updatedUser);
        try{
          const response = await axios.patch(`http://localhost:3000/userProfile/edit/${user.userID}`, updatedUser, {
            headers: {
              Authorization: `Bearer: ${token}`
                }});
          if(response && response.data){ 
            setUserInfo(response.data.newUserDetails);
          }

        } catch (err){
          setError('Error updating user details', err);
        }
      
    }

  return(
    <div className='main-container'>
        <h3>Current User info</h3>
        <p>{userInfo.username}</p>
        <p>{userInfo.first_name}</p>
        <p>{userInfo.last_name}</p>
        <p>{userInfo.email_address}</p>
        <button onClick={() => setAskPassword(true)}>Edit Details</button>

        {askPassword && (<div>
          <h4>Enter your password</h4>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter current password" />
          <button onClick={checkPassword}>Submit</button>
          <button onClick={() => setAskPassword(false)}>Cancel</button>
        </div>
      )}
        {existingUser && (<div>
          <h4>Change current user details</h4>
          <form onSubmit={editUserInfo}>
          <input type="text" name="username" placeholder="User name" defaultValue={userInfo.username} onChange={(e) => setUpdatedUser({...updatedUser, username: e.target.value})}/>
          <input type="text" name="first name" placeholder="Fist name" defaultValue={userInfo.first_name} onChange={(e) => setUpdatedUser({...updatedUser, first_name: e.target.value})}/>
          <input type="text" name="last name" placeholder="Last name" defaultValue={userInfo.last_name} onChange={(e) => setUpdatedUser({...updatedUser, last_name: e.target.value})}/>
          <input type="text" name="email address" placeholder="Email Address" defaultValue={userInfo.email_address} onChange={(e) => setUpdatedUser({...updatedUser, email_address: e.target.value})}/>
          <input type="password" name="password" placeholder="Password" defaultValue={userInfo.password} onChange={(e) => setUpdatedUser({...updatedUser, password: e.target.value})}/>
          <button type="submit" className='submitBtn'>Submit</button>   
          </form>

        </div>
      )}
        
    </div>
  )
} 

export default Profile;