import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function EditEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { event } = location.state || {};
  const [token, setToken] = useState('');
  const [localEvent, setLocalEvent] = useState(event || {});
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  
  const extractDate = (isoString) => (isoString ? isoString.split('T')[0] : '');

 
  const extractTime = (isoString) =>
    isoString ? isoString.split('T')[1]?.slice(0, 5) : '';

  
  useEffect(() => {
    if (event) {
      setStartTime(extractTime(event.eventStart_date));
      setEndTime(extractTime(event.eventEnd_date));
    }
  }, [event]);

  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const editEvent = async (updatedEvent) => {  
    if (!token) return;
    try {
      const response = await axios.patch(
        `http://localhost:3000/events/edit/${localEvent.eventID}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        navigate('/eventList');
      }
    } catch (e) {
      setError('Could not edit event. Please try again later.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = localEvent.eventStart_date.split('T')[0];
    const endDate = localEvent.eventEnd_date.split('T')[0];
  
    const eventStart_date = `${startDate}T${startTime}:00`;
    const eventEnd_date = `${endDate}T${endTime}:00`;

    const updatedEvent = {
      ...localEvent,
      eventStart_date,
      eventEnd_date,
    };

    editEvent(updatedEvent);
  };

  return (
    <div>
      <button onClick={() => navigate('/eventList')}>Back</button>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={localEvent.event_title || ''}
          onChange={(e) =>
            setLocalEvent({ ...localEvent, event_title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Event Description"
          value={localEvent.event_description || ''}
          onChange={(e) =>
            setLocalEvent({
              ...localEvent,
              event_description: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Event Location"
          value={localEvent.location || ''}
          onChange={(e) =>
            setLocalEvent({ ...localEvent, location: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Event Start Date"
          value={extractDate(localEvent.eventStart_date)}
          onChange={(e) =>
            setLocalEvent({ ...localEvent, eventStart_date: e.target.value })
          }
        />
        <input
          type="time"
          name="eventStart_time"
          placeholder="Event Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="date"
          placeholder="Event End Date"
          value={extractDate(localEvent.eventEnd_date)}
          onChange={(e) =>
            setLocalEvent({ ...localEvent, eventEnd_date: e.target.value })
          }
        />
        <input
          type="time"
          name="eventEnd_time"
          placeholder="Event End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditEvent;
