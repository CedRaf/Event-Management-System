import React, { useState } from 'react';
import { createEvent } from '../components/Api'; 

const EventCreation = () => {
  const [eventData, setEventData] = useState({
    event_title: '',
    event_description: '',
    event_date: '',
    userID: '', 
    categoryID: '' 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await createEvent(eventData);
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event.');
    }
  };

  return (
    <div className="event-creation">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="event_title"
            value={eventData.event_title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="event_description"
            value={eventData.event_description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="event_date"
            value={eventData.event_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category ID:
          <input
            type="number"
            name="categoryID"
            value={eventData.categoryID}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Create</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default EventCreation;
