import React, { useState } from "react";
import "../../event-list.css";

const AddEvent = ({
  createEvent,
  newEvent,
  setNewEvent,
  toggleModal,
  setToggleModal,
  categories,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trueStart = `${newEvent.eventStart_date}T${startTime}:00`;
    const trueEnd = `${newEvent.eventEnd_date}T${endTime}:00`;

    // Update newEvent with the concatenated datetime
    const updatedEvent = {
      ...newEvent,
      eventStart_date: trueStart,
      eventEnd_date: trueEnd,
    };

    console.log(updatedEvent, trueStart, trueEnd, newEvent);
    createEvent(updatedEvent);
    setToggleModal(false);
  };

  return (
    <div className="event-creation">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit} className="eventForm">
        <input
          type="text"
          id="event_title"
          name="event_title"
          placeholder="Event Title"
          value={newEvent.event_title}
          onChange={handleChange}
        />
        <input
          type="text"
          id="event_description"
          name="event_description"
          placeholder="Event Description"
          value={newEvent.event_description}
          onChange={handleChange}
        />
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Event Location"
          value={newEvent.location}
          onChange={handleChange}
        />
        <input
          type="date"
          id="eventStart_date"
          name="eventStart_date"
          placeholder="Event Date"
          value={newEvent.eventStart_date}
          onChange={handleChange}
        />
        <input
          type="time"
          id="eventStart_time"
          
          placeholder="Event Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="date"
          id="eventEnd_date"
          name="eventEnd_date"
          placeholder="Event End Date"
          value={newEvent.eventEnd_date}
          onChange={handleChange}
        />
        <input
          type="time"
          id="eventEnd_time"
          
          placeholder="Event End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <select
          name="categoryID"
          id="category"
          value={newEvent.categoryID || ""}
          onChange={(e) => {
            const selectedCategory = categories.find(
              (category) => String(category.categoryID) === e.target.value
            );
            setNewEvent((prevState) => ({
              ...prevState,
              categoryID: selectedCategory?.categoryID, // Set categoryID
            }));
          }}
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

        <div className="cancel-submit-container">
          <button
            onClick={() => setToggleModal(!toggleModal)}
            className="close-add-event-button"
          >
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
