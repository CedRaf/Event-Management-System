import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

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
    try {
      const response = await axios.patch(`http://localhost:3000/recipient/rsvpStatusUpdate/${rsvpID}/${user.userID}`, {
        response: newResponse
      },
        {
        headers: {
          Authorization: `Bearer: ${token}`
            }
      });
      if(response){

      }
  

    } catch (error) {
      console.error("Error sending response:", error);
    }
  };
  const handleRSVPCancel = async (rsvpID) => {
    try {
      const response = await axios.patch(`http://localhost:3000/recipient/cancelRSVP/${rsvpID}/${user.userID}`, 
        {
        headers: {
          Authorization: `Bearer: ${token}`
            }
      });
      if(response){

      }
  

    } catch (error) {
      console.error("Error sending response:", error);
    }
  };
 
  return (
    <div className="rsvp-list">
      <h2>RSVP List</h2>
      {/* <input type="text" placeholder="Find Event" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchEvent(searchTerm)}> SEARCH </button> */}
      <ul>
        {userRSVPs.map((invite) => (
          <li key={invite.rsvpID}>
          
               
              <button onClick={()=> { 
                            navigate("/Event", { 
                                state: { 
                                  event: invite.rsvp.event                                
                                } 
                            });
                        }}>{invite.rsvp.event.event_title}</button>
              {invite.rsvp.event.location} {invite.rsvp.event.eventStart_date} {invite.rsvp.event.eventEnd_date}  
              Current response: {invite.response}

              {invite.response === "PENDING" && (
              <div>
                <button 
                  onClick={() => handleRSVPResponse(invite.rsvpID, "ACCEPTED")}
                >
                  ACCEPT
                </button>
                <button 
                  onClick={() => handleRSVPResponse(invite.rsvpID, "DECLINED")}
                >
                  DECLINE
                </button>
              </div>
            )}

              {invite.response === "ACCEPTED" && (
              <div>
                <button 
                  onClick={() => handleRSVPCancel(invite.rsvpID)}
                >
                  CANCEL
                </button>
              </div>
            )}
              
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSVPList;
