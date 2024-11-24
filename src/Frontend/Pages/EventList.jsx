import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent } from '../components/EventAPI';

function EventList () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [newEvent, setNewEvent] = useState('');


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
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents(user.userID);
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    fetchEvents();
  }, [token, user]);

    const createCategory = async(newEvent) =>{
      setNewEvent(prev => ({
          ...prev, // Preserve existing fields
          userID: user.userID, // Set the userID
      }));

      try{
          console.log(newEvent);
          const response = await axios.post(`http://localhost:3000/events/create`, newEvent, {
              headers: {
                  Authorization: `Bearer: ${token}`
                      }}); 
          if(response){
              setError(response.data.message);
              window.location.reload();
          }
      }catch(e){
          setError('Could not register category. Please try again later.');
      }
  }

  const searchEvent = (searchTerm) =>{
    if(searchTerm){
    const results = events.filter((event) =>
      event.event_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Case-insensitive search
    );
        setFilteredEvents(results);
    }
    else{
      setFilteredEvents(events);
    }
}

  const handleDelete = async (eventID) => {
    try {
      await deleteEvent(eventID);
      setEvents((prev) => prev.filter((event) => event.eventID !== eventID));
    } catch (err) {
      alert('Error deleting the Event');
    }
  };

  return (
    <div className="event-list">
      <h2>Event List</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {filteredEvents.map((event) => (
          <li key={event.eventID}>
            <h3>{event.event_title}</h3>
            <p>{event.event_description}</p>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(event.eventID)}>Delete</button>
          </li>
        ))}
      </ul>
        <button onClick={()=> setAddToggle((prevState) => !prevState)}> ADD </button>
                  {addtoggle && <div> 
                      <CreateEvent createCategory= {createCategory} newCategory= {newCategory} setNewCategory = {setNewCategory}/>                    
                  </div>}
    </div>
  );
};

export default EventList;
