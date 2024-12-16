import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./MiniDashboard.css";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [ongoingEvents, setOngoingEvents] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser && storedToken) {
      setToken(storedToken);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const getUpcomingEvents = async () => {
      if (!token && !user) {
        //because these arent initialized right away
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/events/findAll/${user.userID}`,
          {
            headers: {
              Authorization: `Bearer: ${token}`,
            },
          }
        );
        if (response) {
          setUpcomingEvents(response.data.upcomingEvents);
          console.log(response);
        }
      } catch (err) {
        setError("Error fetching the Event");
      }
    };

    const getNotifications = async () => {
      if (!token && !user) {
        //because these arent initialized right away
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/notifications/getAllNotifications/${user.userID}`,
          {
            headers: {
              Authorization: `Bearer: ${token}`,
            },
          }
        );
        if (response) {
          setNotifications(response.data.allNotifications);
          console.log(response);
          // console.log=(notifications);
        }
      } catch (err) {
        setError("Error fetching the Event");
      }
    };

    getUpcomingEvents();
    getNotifications();
  }, [token, user]);

  const formattedEvents = useMemo(
    () =>
      upcomingEvents.map((event) => ({
        id: String(event.eventID),
        title: event.event_title,
        start: new Date(event.eventStart_date).toISOString(),
        extendedProps: {
          description: event.event_description,
          end: new Date(event.eventEnd_date).toISOString(),
          location: event.location,
          userID: event.userID,
          categoryID: event.categoryID,
        },
      })),
    [upcomingEvents]
  );

  const nextWeek = Array.from({ length: 7 }, (_, i) => {
    //is an array of dates (is ISO foramt?)
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const eventsOfDate = formattedEvents.filter((event) => {
    //checks
    const eventDate = new Date(event.start).toDateString();
    return eventDate === selectedDate.toDateString(); // This checks if it's today's date
  });

  const handleDateClick = (date) => {
    //navigate the to render events on the next day
    setSelectedDate(new Date(date));
  };

  const currentNotifications = notifications;

  useEffect(() => {
    const now = new Date();

    const ongoing = eventsOfDate.filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.extendedProps.end);
      return now >= start && now <= end;
    });

    setOngoingEvents(ongoing); // Set ongoing events
  }, [formattedEvents]);

  return (
    <div className="mainDashboard">
      <Sidebar />
      <div className="BODY">
        <div className="dashboard">
          <h2 className="title">Dashboard</h2>
          <div className="upper-dashboard">
            <div className="notifs">
              <h2>Notifications</h2>
              <ul>
                {currentNotifications.map((notification) => (
                  <li key={notification.notificationID}>
                    <p>{notification.message}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="upcoming-events">
              <h2>Upcoming Events</h2>
              <div className="dates-list">
                {nextWeek.map((date) => (
                  <div
                    key={date.toDateString()}
                    className={`date-item ${
                      selectedDate.toDateString() === date.toDateString()
                        ? "selected"
                        : "non-selected"
                    }`}
                  >
                    <button onClick={() => handleDateClick(date)}>
                      {date.toDateString()}{" "}
                    </button>
                  </div>
                ))}
              </div>
              <div className="events-list"></div>
              {eventsOfDate.length > 0 ? ( //map all events of the selectedDate, the reason this changes when selected date changes is because its part of its update process
                eventsOfDate.map((event) => (
                  <div key={event.id} className="upComingevent-card">
                    <b>{event.title}</b>
                    <p className="upcoming-loc">📍{event.extendedProps.location}</p>
                    <p className="upcoming-time">
                      {new Date(event.start).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p>No events for this date.</p> //ternary statement, if no events states no events
              )}
            </div>
          </div>
          <div className="lower-dashboard">
            <div className="ongoing-events">
              <h2>Ongoing-Events</h2>
              <div className="ongoing-events-list">
                {ongoingEvents.length > 0 ? ( //map all events of the selectedDate, the reason this changes when selected date changes is because its part of its update process
                  ongoingEvents.map((event) => (
                    <div key={event.id} className="event-card">
                      <b>{event.title}</b>
                      <p className="ongoing-loc">📍{event.extendedProps.location}</p>
                      <p>
                        {new Date(event.start).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No ongoing events</p> //ternary statement, if no events states no events
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
