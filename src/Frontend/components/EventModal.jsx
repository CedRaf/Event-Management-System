import React, { useState } from "react";

function EventModal({
  submitFormHandler,
  toggleModal,
  setToggleModal,
  categories,
}) {
  const [event, setEvent] = useState({
    event_title: "",
    event_description: "",
    eventStart_date: "",
    eventStart_time: "",
    eventEnd_date: "",
    eventEnd_time: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    submitFormHandler(event);
  };

  return (
    <div className="calendar-modal">
      <h1>New Event</h1>
      <form onSubmit={(e) => submitForm(e)}>
        <label htmlFor="event_title">Event Title</label>
        <input
          type="text"
          id="event_title"
          name="event_title"
          required
          value={event.event_title}
          onChange={handleChange}
        />
        <label htmlFor="event_description">Event Description</label>
        <input
          type="text"
          id="event_description"
          name="event_description"
          required
          value={event.event_description}
          onChange={handleChange}
        />
        <label htmlFor="eventStart_date">Event Start Date</label>
        <input
          type="date"
          id="eventStart_date"
          name="eventStart_date"
          required
          value={event.eventStart_date}
          onChange={handleChange}
        />
        <label htmlFor="eventStart_time">Event Start Time</label>
        <input
          type="time"
          id="eventStart_time"
          name="eventStart_time"
          required
          value={event.eventStart_time}
          onChange={handleChange}
        />
        <label htmlFor="eventEnd_date">Event End Date</label>
        <input
          type="date"
          id="eventEnd_date"
          name="eventEnd_date"
          required
          value={event.eventEnd_date}
          onChange={handleChange}
        />
        <label htmlFor="eventEnd_time">Event End Time</label>
        <input
          type="time"
          id="eventEnd_time"
          name="eventEnd_time"
          required
          value={event.eventEnd_time}
          onChange={handleChange}
        />
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          required
          value={event.category}
          onChange={handleChange}
        >
          {categories && categories.length > 0 ? (
            <>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </>
          ) : (
            <option value="" disabled>
              You don't have any categories
            </option>
          )}
        </select>

        <button type="submit">Create Event</button>
        <button
          onClick={() => setToggleModal(!toggleModal)}
          className="close-calendar-modal-button"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EventModal;
