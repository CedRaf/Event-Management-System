import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";
import axios from "axios";
import "../../calendar.css";

function Calendar() {
  const [toggleModal, setToggleModal] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [events, setEvents] = useState([]);
  const [cleanedEvents, setCleanedEvents] = useState([]);

  const handleDateClick = (arg) => {
    setToggleModal(true);
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
    fetchAllEvents();
  }, []);

  useEffect(() => {
    let modifiedEvents = events.map((event) => {
      console.log(event);
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
      eventEnd_time === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (new Date(newEvent.eventStart_date) > new Date(newEvent.eventEnd_date)) {
      alert("Event start date cannot be after event end date");
      return;
    }

    if (
      new Date(newEvent.eventStart_date) < new Date() ||
      new Date(newEvent.eventEnd_date) < new Date()
    ) {
      alert("Event date cannot be in the past");
      return;
    }

    let eventStart = new Date(
      newEvent.eventStart_date + "T" + newEvent.eventStart_time
    );
    let eventEnd = new Date(
      newEvent.eventEnd_date + "T" + newEvent.eventEnd_time
    );

    let newEventData = {
      event_title: newEvent.event_title,
      event_description: newEvent.event_description,
      eventStart_date: eventStart,
      eventEnd_date: eventEnd,
      location: "somewhere",
      userID: user.userID,
      categoryID: 1,
    };
    try {
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

  return (
    <div className="calendar">
      <Sidebar></Sidebar>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={cleanedEvents}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
      {toggleModal && (
        <EventModal
          submitFormHandler={submitFormHandler}
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
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
