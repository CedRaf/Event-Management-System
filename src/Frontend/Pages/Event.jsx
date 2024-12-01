import React, { useEffect, useState } from 'react';
import { getAllAPI, deleteAPI } from '../components/EventAPI';
import AddEvent from '../Add/AddEvent'
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';


function Event () {
  const navigate = useNavigate();
  const location = useLocation();
  const {event} = location.state || {};
  const [RSVPDetails, setRSVPDetails] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [toggleRSVP, setToggleRSVP]= useState(false);
  const [hasRSVP, setHasRSVP] = useState(false);
  
    useEffect(() =>{

      const storedToken = localStorage.getItem('token');
      if(storedToken){
          setToken(storedToken);
      }

      const getRSVPDetails = async() => {
        try {
          const response = await axios.get(`http://localhost:3000/getDetails/${event.eventID}`);
          if(response && response.data){
            setRSVPDetails(response.data.rsvpDetails);
          }

        } catch (error) {
          setError("unable to fetch events");
        }
      }
      getRSVPDetails();
  }, [])

    const createRSVP = async() =>{
      if(!token){
        return;
      }
      try{

      }catch(e){
        setError("Unable to invite members");
      }
    }

    const inviteMembers = async() =>{

    }
    const toggleStatus = async() =>{

    }
  

  
      
  
   
  
    return (
      <div>
        <h1>{event.event_title}</h1>
        <p>Description: {event.event_description}</p>
        <p>Date: {new Date(event.event_date).toLocaleString()}</p>
        <p>Created At: {new Date(event.created_at).toLocaleString()}</p>
        <button onClick= {()=> setToggleRSVP((prevState) => !prevState)}>Create RSVP</button>
        {RSVPDetails && <div>
          <p>Event: {RSVPDetails.event.event_title}</p>
          <ul>
            Invited Members:
            {RSVPDetails.recipients.map((recipient) => (
              <li key={recipient.user.email}>
                {recipient.user.first_name} {recipient.user.last_name} ({recipient.user.email_address})
              </li>
            ))}
          </ul>

          Change Event status: {eventStatus}
          <select value={eventStatus} onChange={(event) => setEventStatus(event.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETE">Complete</option>
          </select>
          <button>Update Status</button>


          <button>Invite Members</button>
        </div>}
        {!RSVPDetails && <div>
          <button>Create RSVP!</button>  
        </div>}
      </div>
    );
  };
  
  export default Event;
  