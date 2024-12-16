import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";
import EventDetails from "../components/EventDetails";
import "../../calendar.css";

function Calendar() {
  const [toggleModal, setToggleModal] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [events, setEvents] = useState([]);
  const [cleanedEvents, setCleanedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toggleEventDetails, setToggleEventDetails] = useState(false);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [eventDetailModalPosition, setEventDetailModalPosition] = useState({});

  const handleDateClick = (arg) => {
    setToggleModal(true);
  };

  const handleEventClick = (arg) => {
    const { clientX, clientY } = arg.jsEvent;
    setEventDetailModalPosition({ clientX, clientY });
    const clickedEvent = events.find(
      (event) => event.event_title === arg.event.title
    );
    setClickedEvent(clickedEvent);
    setToggleEventDetails(true);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser && storedToken) {
      setToken(storedToken);
      setUser(parsedUser);
    }
    async function fetchAllEvents() {
      try {
        const response = await axios.get(
          `http://localhost:3000/events/findAll/${parsedUser.userID}`,
          {
            headers: {
              Authorization: `Bearer: ${storedToken}`,
            },
          }
        );
        setEvents(response.data.eventList);
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    }

    async function fetchAllCategories() {
      try {
        const response = await axios.get(
          `http://localhost:3000/eventCategory/findAll/${parsedUser.userID}`,
          {
            headers: {
              Authorization: `Bearer: ${storedToken}`,
            },
          }
        );
        setCategories(response.data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    }
    fetchAllEvents();
    fetchAllCategories();
  }, []);

  useEffect(() => {
    let modifiedEvents = events.map((event) => {
      const trimmedDate = event.eventStart_date.substring(0, 10);
      return {
        title: event.event_title,
        date: trimmedDate,
      };
    });
    setCleanedEvents(modifiedEvents);
  }, [events]);

  const submitFormHandler = async (newEvent) => {
    if (
      event_title === "" ||
      event_description === "" ||
      eventStart_date === "" ||
      eventStart_time === "" ||
      eventEnd_date === "" ||
      eventEnd_time === "" ||
      category === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (new Date(newEvent.eventStart_date) > new Date(newEvent.eventEnd_date)) {
      alert("Event start date cannot be after event end date");
      return;
    }

    
    const eventStart = new Date(
      newEvent.eventStart_date + "T" + newEvent.eventStart_time
    );
    const eventEnd = new Date(
      newEvent.eventEnd_date + "T" + newEvent.eventEnd_time
    );

    const now = new Date()
    
    const newEventData = {
      event_title: newEvent.event_title,
      event_description: newEvent.event_description,
      eventStart_date: eventStart,
      eventEnd_date: eventEnd,
      location: "somewhere",
      userID: user.userID,
      categoryID: 1,
    };
    
    if (
      new Date(eventStart) < now ||
      new Date(eventEnd) < now
    ) {
      alert("Event date cannot be in the past");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/eventCategory/find/${newEvent.category}`,
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      );
      const foundCategory = response.data.existingCategory.find(
        (category) => category.category_name === newEvent.category
      );
      newEventData.categoryID = foundCategory.categoryID;
      await axios.post("http://localhost:3000/events/create", newEventData, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });
    } catch (e) {
      console.error("Error creating event:", e);
      return;
    }
    let setEventData = {
      event_title: newEvent.event_title,
      event_description: newEvent.event_description,
      eventStart_date: eventStart.toISOString(),
      eventEnd_date: eventEnd.toISOString(),
      location: "somewhere",
      userID: user.userID,
      categoryID: 1,
    };
    setEvents([...events, setEventData]);
    setToggleModal(false);
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3000/events/delete/${eventId}`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });
    } catch (e) {
      console.error("Error deleting event:", e);
      return;
    }
    const newEvents = events.filter((event) => event.eventID !== eventId);
    setEvents(newEvents);
    setToggleEventDetails(false);
  };

  return (
    <div className="calendar">
      <Sidebar></Sidebar>
      <button className="new-event-button" onClick={handleDateClick}>
        New Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={cleanedEvents}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      {toggleEventDetails && (
        <EventDetails
          event={clickedEvent}
          setToggleEventDetails={setToggleEventDetails}
          toggleEventDetails={toggleEventDetails}
          deleteEventHandler={deleteEventHandler}
          eventDetailModalPosition={eventDetailModalPosition}
        ></EventDetails>
      )}
      {toggleModal && (
        <EventModal
          submitFormHandler={submitFormHandler}
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
          categories={categories}
        ></EventModal>
      )}
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Calendar;
