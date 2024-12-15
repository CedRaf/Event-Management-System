import React, { useEffect, useState } from 'react';
import { getAllAPI, deleteAPI } from '../components/EventAPI';
import AddEvent from '../Add/AddEvent'
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx";
import "../../event.css";

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
  const [isAdmin, setIsAdmin]= useState(false);
  
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
      if(event.userID === user.userID){
        setIsAdmin(true);
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
            setEventStatus(response.data.rsvpDetails.status);
            
            
  
            
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
          
            window.location.reload()
          }

        }catch(e){
          setError("unable to create RSVP");

        }

    }

    const updateStatus = async(e) =>{
      e.preventDefault();
      
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
        console.log(response.data.editedRSVP, response.data.recipientData)
        setRSVPDetails((prevState) => ({
          ...prevState, // keep other properties of RSVPDetails unchanged
          status: response.data.editedRSVP.status, // update only the status property
        }));
      }
      }catch (e){
        setError("Unable to invite members");
      }
       
    }
  
    const inviteMembers = async (e) => {
      e.preventDefault();
    
      const formattedRecipients = newRecipients
        .split(',')
        .map((email) => email.trim()) 
        .filter((email) => email !== '');
    
      
      setRecipients((prevRecipients) => [...prevRecipients, ...formattedRecipients]);
    
      
      const PAYLOAD = {
        eventID: event.eventID,
        status: eventStatus,
        recipients: [...recipients, ...formattedRecipients], 
      };
    
      try {
        const response = await axios.patch(
          `http://localhost:3000/rsvp/edit/${RSVPDetails.rsvpID}`,
          PAYLOAD,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          console.log(response);
          window.location.reload();
        }
      } catch (e) {
        setError('Unable to invite members');
      }
    };
      
  
   
  
    return (
      <>
      
  <Sidebar />
  <div className='event-parent'>
  <div className='event-container'>
    <h1 className='event-title'>{event.event_title}</h1>
    <div className='event-detail'>
      <p className='event-description'>Description: {event.event_description}</p>
      <p className='event-start-date'>Start Date: {new Date(event.eventStart_date).toLocaleString()}</p>
      <p className='event-end-date'>End Date: {new Date(event.eventEnd_date).toLocaleString()}</p>
      <p className='event-created-at'>Created At: {new Date(event.created_at).toLocaleString()}</p>
    </div>

    {hasRSVP && (
      <div className='rsvp-details'>
        <p className='rsvp-status'>Current RSVP status: {RSVPDetails.status}</p>
        <ul className='rsvp-invited-members'>
          {RSVPDetails.recipients.map((recipient) => (
            <li className='rsvp-member' key={recipient.user.email_address}>
              {recipient.user.first_name} {recipient.user.last_name} (
              {recipient.user.email_address}) - {recipient.response}
            </li>
          ))}
        </ul>
     
        {isAdmin && (
          <div className='event-edit-container'>
            <form className='status-update-form' onSubmit={updateStatus}>
              <select
                className='status-select'
                value={eventStatus}
                onChange={(event) => setEventStatus(event.target.value)}
              >
                <option value='ACTIVE'>Active</option>
                <option value='CANCELLED'>Cancelled</option>
                <option value='COMPLETED'>Complete</option>
              </select>
              <button type='submit' className='update-button'>
                Update Status
              </button>
            </form>
          <div className='invite-members'>
            <button
              className='invite-button'
              onClick={() => setInviteToggle((prevState) => !prevState)}
            >
              Invite Members!
            </button>
            {inviteToggle && (
              <div className='invite-members-form-container'>
                <form className='invite-members-form' onSubmit={inviteMembers}>
                  <input
                    className='invite-input'
                    value={newRecipients}
                    onChange={(e) => setNewRecipients(e.target.value)}
                    placeholder='Enter member emails separated by a comma'
                  />
                  <button type='submit' className='submit-invite-button'>
                    Submit
                  </button>
                </form>
              </div>
            )}
            </div>
          </div>
        )}
      </div>

    )}
   



    {!hasRSVP && isAdmin && (
      <div className='create-rsvp-container'>
        <button
          className='create-rsvp-button'
          onClick={() => setCreateToggle((prevState) => !prevState)}
        >
          Create RSVP!
        </button>
        {createToggle && (
          <div className='create-rsvp-form-container'>
            <form className='create-rsvp-form' onSubmit={createRSVP}>
              <input
                className='create-input'
                value={newRecipients}
                onChange={(e) => setNewRecipients(e.target.value)}
                placeholder='Enter member emails separated by a comma'
              />
              <button type='submit' className='submit-create-button'>
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    )}
  </div>
</div>
</>
    );
  };
  
  export default Event;
  