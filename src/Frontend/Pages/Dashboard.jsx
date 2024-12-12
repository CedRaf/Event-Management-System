import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


function NotificationList () {
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

    getNotifications();
  }, [token, user]);

  useEffect(() => {
    const formattedEvents = events.map((event) => {
      
      const trimmedDate = event.eventStart_date.substring(0, 10);
      return {
        title: event.event_title,
        date: trimmedDate,
      };
    });
    setCleanedEvents(formattedEvents);
  }, [upcomingEvents]);
 



    return (    
    <div className="dashboard">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridWeek"
            weekends={true}
            events={cleanedEvents}
            eventContent={renderEventContent}
            dateClick={handleDateClick}
        />
    </div>
  );
};

export default NotificationList;
