import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent } from '../components/Api';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    fetchEvents();
  }, []);

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
        {events.map((event) => (
          <li key={event.eventID}>
            <h3>{event.event_title}</h3>
            <p>{event.event_description}</p>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(event.eventID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
