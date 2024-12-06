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


  return (
    <div className="rsvp-list">
      <h2>RSVP List</h2>
      {/* <input type="text" placeholder="Find Event" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchEvent(searchTerm)}> SEARCH </button> */}
      <ul>
        {userRSVPs.map((invite) => (
          <li key={invite.rsvpID}>
          
              {invite.rsvp.event.event_title} {invite.rsvp.event.location} {invite.rsvp.event.eventStart_date} {invite.rsvp.event.eventEnd_date}
              Current response: {invite.response}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSVPList;
