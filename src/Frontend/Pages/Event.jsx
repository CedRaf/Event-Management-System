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
  const [user, setUser] =useState('');
  const [error, setError] = useState(null);
  const [toggleRSVP, setToggleRSVP]= useState(false);
  const [hasRSVP, setHasRSVP] = useState(false);
  const [eventStatus, setEventStatus]= useState('');
  const [recipients, setRecipients]= useState([]);
  const [newRecipients, setNewRecipients]= useState([]);
  const [createToggle, setCreateToggle]= useState(false);
  const [inviteToggle, setInviteToggle]= useState(false);
  
    useEffect(() =>{

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const parsedUser = JSON.parse(storedUser);
  
      if(storedToken && storedUser){
          setToken(storedToken);
          setUser(parsedUser);
      }
    },[])


    useEffect(() =>{
      if(!token && !user){ //because these arent initialized right away
        return;
      }
      
      const getUserRSVPS = async() => {
       
        try {
          const response = await axios.get(`http://localhost:3000/rsvp/getDetails/${event.eventID}`, {
            headers: {
              Authorization: `Bearer: ${token}`
                }});
                
          if(response && response.data){
            
            setRSVPDetails(response.data.rsvpDetails);
            const emailAddresses = response.data.rsvpDetails.recipients
            .map(recipient => recipient.user?.email_address) // Safely access email_address
            .filter(email => email);

            
            
            
            setRecipients(emailAddresses);
           
            setHasRSVP(true);
            
          }

        } catch (error) {
          setError("unable to fetch users rsvps");
        }
      }
      getUserRSVPS();
  }, [user, token])



    const createRSVP = async(e) =>{
        e.preventDefault();
        const formattedRecipients = newRecipients
        .split(',')
        .map(email => email.trim()) // Remove any extra spaces around the emails
        .filter(email => email !== '');

        const PAYLOAD= {
          senderUserID: user.userID,
          eventID: event.eventID,
          recipients: formattedRecipients  
        }
        
        try{
          const response = await axios.post(`http://localhost:3000/rsvp/create`, PAYLOAD , {
            headers: {
              Authorization: `Bearer ${token}`
            }
            }
          );
          if(response && response.data){
            console.log(response)
            setRSVPDetails((prevDetails) => ({
              ...prevDetails, // Retain existing values
              ...response,    // Apply new values on included attribtues
            }));
          }

        }catch(e){
          setError("unable to create RSVP");

        }

    }

    const updateStatus = async(e) =>{
      e.preventDefault();
      console.log(event.eventID, eventStatus, recipients )
      try{
      const response = await axios.patch(`http://localhost:3000/rsvp/edit/${RSVPDetails.rsvpID}`, 
        {
        eventID: event.eventID,
        status: eventStatus,
        recipients: recipients
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        }
      );
      if(response && response.data){

      }
      }catch (e){
        setError("Unable to invite members");
      }
       
    }
  
    const inviteMembers = async(e) =>{
      e.preventDefault();
      const formattedRecipients = newRecipients
      .split(',')
      .map(email => email.trim()) // Remove any extra spaces around the emails
      .filter(email => email !== '');

      setRecipients((prevRecipients) => [
        ...prevRecipients,
        ...formattedRecipients,
      ]);


      const PAYLOAD= {
        eventID: event.eventID,
        status: eventStatus,
        recipients: recipients  
      }
      console.log(user.userID, PAYLOAD)
      try{
        const response = await axios.patch(`http://localhost:3000/rsvp/edit/${RSVPDetails.rsvpID}`, PAYLOAD , {
          headers: { //if payload doesnt work format to same as status ^^
            Authorization: `Bearer ${token}`
          }
          }
        );
        if(response && response.data){
            console.log(response);
        }

      }catch(e){
        setError("unable to create RSVP");

      }

  }
  
      
  
   
  
    return (
      <div>
        <h1>{event.event_title}</h1>
        <p>Description: {event.event_description}</p>
        <p>Start Date: {new Date(event.eventStart_date).toLocaleString()}</p>
        <p>End Date: {new Date(event.eventEnd_date).toLocaleString()}</p>
        <p>Created At: {new Date(event.created_at).toLocaleString()}</p>



        {hasRSVP && <div>
          Current RSVP status: {RSVPDetails.status}
          <ul>
            Invited Members:
            {RSVPDetails.recipients.map((recipient) => (
              <li key={recipient.user.email_address}>
                {recipient.user.first_name} {recipient.user.last_name} ({recipient.user.email_address})
                {recipient.response}
              </li>
            ))}
          </ul>

          <form onSubmit={updateStatus}>
          <select value={eventStatus} onChange={(event) => setEventStatus(event.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Complete</option>
          </select>
          <button type="submit">Update Status</button>
          </form>


          <button onClick={()=> setInviteToggle((prevState) => !prevState)}> Invite members! </button>
                  {inviteToggle && <div> 
                    <form onSubmit={inviteMembers}>
                        <input
                          value={newRecipients} onChange={(e) => setNewRecipients(e.target.value)} placeholder="Enter member emails separated by a comma"
                        />
                        <button type="submit">Submit</button>
                    </form>                  
                  </div>}  
        </div>}


        {!hasRSVP && <div>
          <button onClick={()=> setCreateToggle((prevState) => !prevState)}> Create RSVP! </button>
                  {createToggle && <div> 
                    <form onSubmit={createRSVP}>
                        <input
                          value={newRecipients} onChange={(e) => setNewRecipients(e.target.value)} placeholder="Enter member emails separated by a comma"
                        />
                        <button type="submit">Submit</button>
                    </form>                  
                  </div>}  
        </div>}
      </div>
    );
  };
  
  export default Event;
  