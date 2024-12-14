import React, { useEffect, useState } from 'react';
import { getAllAPI, deleteAPI } from '../components/EventAPI';
import AddEvent from '../Add/AddEvent'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import "../../event-list.css";
import Sidebar from "../components/Sidebar.jsx";

function EventList () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    event_title: '',
    event_description: '',
    eventEnd_date: '',
    eventStart_date: '',
    location: '',
    categoryID: ''


  });
  const [addtoggle, setAddToggle]= useState(false);
  const [searchTerm, setSearchTerm]= useState('');
  const [categories, setCategories]= useState([]);
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
        
        const response = await axios.get(`http://localhost:3000/events/findAll/${user.userID}`, {
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response){ 
          setEvents(response.data.eventList);
          setFilteredEvents(response.data.eventList);
          console.log(token);
        }
        
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    getEvents();
  }, [token, user]);

  useEffect(() => {
    const getCategories = async () => {
      if (!token && !user) {
        //because these arent initialized right away
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/eventCategory/findAll/${user.userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error retrieving categories:", error);
      }
    };
    getCategories();
  }, [token, user]);

    const createEvent = async(newEvent) =>{
      //new Event body
      //returns newEvent
      
        const eventData = {
          ...newEvent,
          userID: user.userID, // Make sure userID is set
         
      };
      
      try{
          console.log(eventData, token);
          const response = await axios.post(`http://localhost:3000/events/create`, eventData, {
              headers: {
                  Authorization: `Bearer: ${token}`
                      }}); 
          if(response && response.data){
              setEvents((prevEvents) => [...prevEvents, response.data.newEvent]);
              
          }
      }catch(e){
          setError('Could not register category. Please try again later.');
      }
  }
  
  const deleteEvent = async (eventID) => {
    //eventID params
    //returns deletedEvent
    try {
      const response = await axios.delete(`http://localhost:3000/events/delete/${eventID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response && response.data){
        setError(response.data.message);
        setEvents((prevEvents) => prevEvents.filter((event) => event.eventID !== response.data.deletedEvent.eventID));
    }
    } catch (err) {
      alert('Error deleting the Event', error);
    }
  };

  
  const sortByCategory = () => {

  };

  const sortByLocation = () => {

  }

  const ResetView = () => {

  }

  const sortByStartdate = () => {

  }


  const searchEvent = (searchTerm) =>{

    if(searchTerm){
    const results = events.filter((event) =>
      event.event_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Case-insensitive search
    );
        setEvents(results);
    }
    else{
      setEvents(events);
    }
  }

  const editEvent = (editedEvent)=>{
    //eventID params
    //editedEvent entity body
    //returns updatedEvent , may be removed
  }

  return (
    <>
    <Sidebar />
    <div className='event-list-container'>
    <div className='event-top-container'>
      <h1>Event List</h1>
      <div className='event-input-container'>
      <input type="text" 
      placeholder="Find Event" 
      value= {searchTerm} 
      onChange={(e) => {
        setSearchTerm(e.target.value)}} className='event-input'
        />
            <button onClick={() => searchEvent(searchTerm)} className='event-search-button'> SEARCH </button>
      </div>
     
      <div className='eventContainer'>
       
      <ul className='event-list'>
      
        {events.map((event) => (
          
          <li key={event.eventID} className='event-item'>
            <div className='ul-container'>
            <button onClick={()=> { 
                            navigate("/Event", { 
                                state: { 
                                  event                                
                                } 
                            });
                        }} className='event-button'>{event.event_title}</button>
              </div>
            <div className='date-btn-container'>
            <div className='date-container'>
            <p>Start Date: {new Date(event.eventStart_date).toLocaleDateString()}</p>
            <p>End Date: {new Date(event.eventEnd_date).toLocaleDateString()}</p>
            </div>
            <div className='btnContainer'>
            <button onClick={()=> { 
                            navigate("/editEvent", { 
                                state: { 
                                  event                                
                                } 
                            });
                        }} className='editButton'>EDIT</button>  
            <button onClick={() => deleteEvent(event.eventID)} className='deleteButton'>DELETE</button>
            </div>
            </div>
          </li>
        ))}
      </ul>
      </div>

      
      <div className='add-event-form'>
        <button onClick={()=> setAddToggle((prevState) => !prevState)} className='toggle-create-event'> ADD </button>
                  {addtoggle && <div> 
                      <AddEvent createEvent= {createEvent} newEvent= {newEvent} setNewEvent = {setNewEvent} categories= {categories}/>                    
                  </div>}
       </div>
       </div>
    </div>
    </>
  );
};

export default EventList;
