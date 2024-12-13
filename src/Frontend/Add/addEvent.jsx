import React, { useState } from 'react';
import "../../event-list.css";

const AddEvent = ({createEvent, newEvent, setNewEvent, categories}) => {

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
      <form onSubmit={handleSubmit} className='add-category-form'>
                <input type="text" name="event_title" placeholder="Event Title" value= {newEvent.event_title} onChange={handleChange}/>
                <input type="text" name="event_description" placeholder="Event Description" value= {newEvent.event_description} onChange={handleChange}/>
                <input type="text" name="location" placeholder="Event Location" value= {newEvent.location} onChange={handleChange}/>
                <input type="date" name="eventStart_date" placeholder="Event Date" value= {newEvent.eventStart_date} onChange={handleChange}/>
                <input type="date" name="eventEnd_date" placeholder="Event Date" value= {newEvent.eventEnd_date} onChange={handleChange}/>

                <select
                    name="categoryID"
                    value={newEvent.categoryID}
                    onChange={(e) =>
                      setNewEvent((prevState) => ({
                        ...prevState,
                        categoryID: e.target.value, // Set the selected category's ID
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select a Category
                    </option>
                    {categories.map((category) => (
                      <option key={category.categoryID} value={category.categoryID}>
                        {category.category_name}
                      </option>
                    ))}
               </select>

                <button type="submit">Submit</button>   
            </form>


    </div>
  );
};

export default AddEvent;
