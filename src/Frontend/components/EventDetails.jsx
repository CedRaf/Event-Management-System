import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../calendar.css";

function EventDetails({
  event,
  setToggleEventDetails,
  toggleEventDetails,
  deleteEventHandler,
  eventDetailModalPosition,
}) {
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const extractTime = (isoString) => {
    if (!isoString) return "";
    const [, timeWithMs] = isoString.split("T");
    return timeWithMs.split(".")[0];
  };

  const extractDate = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  useEffect(() => {
    setEventStartTime(extractTime(event.eventStart_date));
    setEventEndTime(extractTime(event.eventEnd_date));
    setEventStartDate(extractDate(event.eventStart_date));
    setEventEndDate(extractDate(event.eventEnd_date));
  }, [event]);

  const eventDetailsStyle = {
    position: "absolute",
    top: eventDetailModalPosition.clientY,
    left: eventDetailModalPosition.clientX,

  }

  return (
    <div className="event-details" style={eventDetailsStyle}>
      <h1>Event Details</h1>
      <p>
        <strong>Event Name:</strong> {event.event_title}
      </p>
      <p>
        <strong>Description:</strong> {event.event_description}
      </p>
      <p>
        <strong>Start Date:</strong> {eventStartDate}
      </p>
      <p>
        <strong>Start Time:</strong> {eventStartTime}
      </p>
      <p>
        <strong>End Date:</strong> {eventEndDate}
      </p>
      <p>
        <strong>End Time:</strong> {eventEndTime}
      </p>
      <p>
        <strong>Category ID:</strong> {event.categoryID}
      </p>
      <button
        className="close-button"
        onClick={() => setToggleEventDetails(!toggleEventDetails)}
      >
        Close
      </button>
      <button
        className="delete-event-button"
        onClick={() => deleteEventHandler(event.eventID)}
      >
        Delete Event
      </button>
    </div>
  );
}

export default EventDetails;
