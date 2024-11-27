import React, { useState } from 'react';


const AddEvent = ({createEvent, newEvent, setNewEvent}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createEvent(newEvent)


  };

  return (
    <div className="event-creation">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
                <input type="text" name="event_title" placeholder="Event Title" value= {newEvent.event_title} onChange={handleChange}/>
                <input type="text" name="event_description" placeholder="Event Description" value= {newEvent.event_description} onChange={handleChange}/>
                <input type="date" name="event_date" placeholder="Event Date" value= {newEvent.event_date} onChange={handleChange}/>


                <button type="submit">Submit</button>   
            </form>


    </div>
  );
};

export default AddEvent;
