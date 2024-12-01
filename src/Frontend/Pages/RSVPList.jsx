import React, { useEffect, useState } from 'react';
import { getAllAPI, deleteAPI } from '../components/EventAPI';
import AddEvent from '../Add/AddEvent'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function EventList () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    event_title: '',
    event_description: '',
    event_date: '',


  });
  const [addtoggle, setAddToggle]= useState(false);
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
        
        const response = await axios.get(`http://localhost:3000/events/findAll/${user.userID}`, {
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response){
          setEvents(response.data);
          setFilteredEvents(response.data);
        }
        
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    getEvents();
  }, [token, user]);

    const createEvent = async(newEvent) =>{
      //new Event body
      //returns newEvent
      
        const eventData = {
          ...newEvent,
          userID: user.userID, // Make sure userID is set
          categoryID: 12
          // Set categoryID
      };
      console.log(eventData);
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
    <div className="event-list">
      <h2>Event List</h2>
      <input type="text" placeholder="Find Event" value= {searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}/>
            <button onClick={() => searchEvent(searchTerm)}> SEARCH </button>
      <ul>
        {events.map((event) => (
          <li key={event.eventID}>
            <button>{event.event_title}</button>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <button onClick={()=> { 
                            navigate("/editEvent", { 
                                state: { 
                                  event                                
                                } 
                            });
                        }}>EDIT</button>  
            <button onClick={() => deleteEvent(event.eventID)}>DELETE</button>
          </li>
        ))}
      </ul>
        <button onClick={()=> setAddToggle((prevState) => !prevState)}> ADD </button>
                  {addtoggle && <div> 
                      <AddEvent createEvent= {createEvent} newEvent= {newEvent} setNewEvent = {setNewEvent}/>                    
                  </div>}
    </div>
  );
};

export default EventList;
