import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import "../../profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [existingUser, setExistingUser] = useState("");
  const [updatedUser, setUpdatedUser] = useState("");
  const [askPassword, setAskPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toggleModal, setToggleModal] = useState("");


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser && storedToken) {
      setToken(storedToken);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!token && !user) {
        //because these arent initialized right away
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/userProfile/get/${user.userID}`,
          {
            headers: {
              Authorization: `Bearer: ${token}`,
            },
          }
        );
        if (response) {
          const { username, first_name, last_name, email_address } =
            response.data.userInformation;
          setUserInfo(response.data.userInformation);
          setUpdatedUser({ username, first_name, last_name, email_address });
        }
      } catch (err) {
        setError("Error fetching the Event");
      }
    };

    getUserInfo();
  }, [token, user]);

  //Display current user info, button for edit information
  //prompt for current password call checkPassword , popup format
  //if receive existingUser in response allow  user to edit
  const checkPassword = async () => {
    
    try {
      const response = await axios.post(
        `http://localhost:3000/userProfile/checkPassword/${user.userID}`,
        {
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      );
      if (response && response.data) {
        setExistingUser(response.data.existingUser);
        setAskPassword(false);
        setPassword("");
        
      }
    } catch (err) {
      setError("Error checking password", err);
    }
    setToggleModal(false);
  };



  const editUserInfo = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.patch(
        `http://localhost:3000/userProfile/edit/${user.userID}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      );
      if (response && response.data) {
        setUserInfo(response.data.newUserDetails);
      }
    } catch (err) {
      setError("Error updating user details", err);
    }
  };

  return (
    <div className="main-container">
      
      <div className="userInfo-container">
      <button onClick={() => navigate('/dashboard')} className='backBtn'>◀︎Back</button>
        <h3>Current User info</h3>

        <div className="userpfp-container">
          <div className="username">
            <div className="userlabel">Username:</div>
            <div>{userInfo.username}</div>
          </div>
          <div className="allInfo-with-btn">
            <div className="pfp-name-email">
              <div className="image">
                <img
                  src="../src/user-solid.svg"
                  alt="profileimg"
                  className="pfp"
                />
              </div>
              <div className="name-email">
                <div className="user-full-name">
                  <p className="firstname">{userInfo.first_name}</p>
                  <p className="lastname">{userInfo.last_name}</p>
                </div>
                <div className="email-contaier">
                  <p className="email">{userInfo.email_address}</p>
                </div>
              </div>
            </div>
            <div className="edit-btn">
              <button onClick={() => setAskPassword(true)}>Edit Details</button>
            </div>
          </div>
        </div>

       
          {askPassword && (
             <div className="enterPassword">
            <div>
              <h4>Enter your password</h4>
              <div className="pass-and-btn">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <div className="btns">
                  <button onClick={checkPassword}>Submit</button>
                  <button
                    onClick={() => {
                      setAskPassword(false);
                      setPassword("");
                      setToggleModal(!toggleModal);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}
     
        {existingUser && (
          <div>
            <h4>Change current user details</h4>
           
            <form onSubmit={editUserInfo}>
            <div className="editUserInfo">
              <input
                type="text"
                name="username"
                placeholder="User name"
                defaultValue={userInfo.username}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, username: e.target.value })
                }
              />
              <input
                type="text"
                name="first name"
                placeholder="Fist name"
                defaultValue={userInfo.first_name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, first_name: e.target.value })
                }
              />
              <input
                type="text"
                name="last name"
                placeholder="Last name"
                defaultValue={userInfo.last_name}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, last_name: e.target.value })
                }
              />
              <input
                type="text"
                name="email address"
                placeholder="Email Address"
                defaultValue={userInfo.email_address}
                onChange={(e) =>
                  setUpdatedUser({
                    ...updatedUser,
                    email_address: e.target.value,
                  })
                }
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                defaultValue={userInfo.password}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, password: e.target.value })
                }
              />
              <button type="submit" className="submitBtn">
                Submit
              </button>
              </div>
            </form>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
