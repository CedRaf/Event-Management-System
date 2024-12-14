import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import "../../rsvp.css";
import Sidebar from '../components/Sidebar';

function RSVPList () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [userRSVPs, setUserRSVPs] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm]= useState('');
  const navigate= useNavigate(); 

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
    const getEvents = async () => {
      if(!token && !user){ //because these arent initialized right away
        return;
      }
      try {
        
        const response = await axios.get(`http://localhost:3000/rsvp/getRSVPs/${user.userID}`, {
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response && response.data){
          setUserRSVPs(response.data.invitations);
        }
        
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    getEvents();
  }, [token, user]);

  const handleRSVPResponse = async (rsvpID, newResponse) => {
    if(!token && !user){ //because these arent initialized right away
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:3000/recipient/rsvpStatusUpdate/${rsvpID}/${user.userID}`, {
        response: newResponse
      },
        {
        headers: {
          Authorization: `Bearer: ${token}`
            }
      });
      if(response.data){
        
        setUserRSVPs((prevRSVPs) =>
          prevRSVPs.map((invite) =>
            invite.rsvpID === rsvpID
              ? { ...invite, response: newResponse }
              : invite
          )
        );
      }
  

    } catch (error) {
      console.error("Error sending response:", error);
    }
  };
  const handleRSVPCancel = async (rsvpID) => {
    if(!token && !user){ //because these arent initialized right away
      return;
    }
    console.log(token);
    try {
      const response = await axios.patch(`http://localhost:3000/recipient/cancelRSVP`, 
        {
          userID: user.userID,
          rsvpID: rsvpID
        },
        {
        headers: {
          Authorization: `Bearer ${token}`
            }
      });
      if(response){

        setUserRSVPs((prevRSVPs) =>
          prevRSVPs.map((invite) =>
            invite.rsvpID === rsvpID
              ? { ...invite, response: "DECLINED", cancelled: true }
              : invite
        )
      );
      }
  

    } catch (error) {
      console.error("Error sending response:", error);
    }
  };
 
  return (
    <div className='RSVP'>
      <Sidebar></Sidebar>
      <div className="rsvp-parent">
        <div className="rsvp-container">
          <h2 className='title'>RSVP List</h2>
          {/* <input type="text" placeholder="Find Event" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchEvent(searchTerm)}> SEARCH </button> */}
            
          <ul className="rsvp-list">
            {userRSVPs.map((invite) => (
              
              <li key={invite.rsvpID} className="rsvp-item">
                <button
                  onClick={() => {
                    navigate("/Event", {
                      state: {
                        event: invite.rsvp.event,
                      },
                    });
                  }}
                  className="event-button"
                >
                  {invite.rsvp.event.event_title}
                </button>
                <div className="btn-container">
                  <div className="event-date-time">
                  <div>Starting from:</div>
                {invite.rsvp.event.location} 
                {invite.rsvp.event.eventStart_date}{" "}
                <div>Ending on:</div>
                {invite.rsvp.event.eventEnd_date}
                <div>
                Current response: {invite.response}
                </div>
                </div>
                {invite.response === "PENDING" && (
                  <div className="respond-btn">
                    <button
                      onClick={() =>
                        handleRSVPResponse(invite.rsvpID, "ACCEPTED")
                      }
                    >
                      ACCEPT
                    </button>
                    <button
                      onClick={() =>
                        handleRSVPResponse(invite.rsvpID, "DECLINED")
                      }
                    >
                      DECLINE
                    </button>
                  </div>
                  
                )}
                
                
                {invite.response === "ACCEPTED" && (
                  <div>
                    <button onClick={() => handleRSVPCancel(invite.rsvpID)}>
                      CANCEL
                    </button>
                  </div>
                )}
                </div>
              </li>
            ))}
          </ul>
          </div>
        </div>
   
    </div>
  );
};

export default RSVPList;
