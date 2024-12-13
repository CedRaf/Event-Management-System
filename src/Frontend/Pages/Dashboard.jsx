import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


function Dashboard () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents]= useState([]);
  const [error, setError] = useState(null);


 

  useEffect(() =>{
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser);
    if(parsedUser && storedToken){
        setToken(storedToken);
        setUser(parsedUser);
    }

}, [])


  useEffect(() => {
    const getUpcomingEvents = async () => {
      if(!token && !user){ //because these arent initialized right away
        return;
      }
      try {
        
        const response = await axios.get(`http://localhost:3000/notifications/getAllNotifications/${user.userID}`, {
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response){ 
          setUpcomingEvents(response.data.upcomingEvents);
          console.log(response);
        }
        
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    getUpcomingEvents();
  }, [token, user]);

    const fullCalendarEvents = upcomingEvents.map((event) => ({
      id: String(event.eventID),             // ID as string
      title: event.event_title,              // Title of the event
      start: event.eventStart_date,          // Start date in ISO format
      extendedProps: {                       // Additional data
        description: event.event_description,
        end: event.eventEnd_date,            // Optional end date
        location: event.location,
        userID: event.userID,
        categoryID: event.categoryID,
      },
    }));
 

    const handleDateClick = (arg) => {
      //navigate the user to event page passing event
    };

    const renderEventContent = (eventInfo) => {
      return (
        <>
          <b>{eventInfo.event.title}</b>
          <p>{eventInfo.event.extendedProps.location}</p>
        </>
      );
    };

    return (    
    <div className="dashboard">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridWeek"
            weekends={true}
            events={fullCalendarEvents}
            eventContent={renderEventContent}
            dateClick={handleDateClick}
        />
    </div>
  );
};

export default Dashboard;
