// import React, { useEffect, useState } from 'react';

// function Calendar({ googleToken }) {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(
//           'https://www.googleapis.com/calendar/v3/calendars/primary/events',
//           {
//             headers: {
//               Authorization: `Bearer ${googleToken}`,
//             },
//           }
//         );
//         const data = await response.json();
//         if (data.items) {
//           setEvents(data.items);
//         } else {
//           console.error('Error fetching events:', data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch events:', error);
//       }
//     };

//     fetchEvents();
//   }, [googleToken]);

//   return (
//     <div>
//       <h2>Your Google Calendar Events</h2>
//       {events.length > 0 ? (
//         <ul>
//           {events.map((event) => (
//             <li key={event.id}>
//               <strong>{event.summary}</strong> - {event.start?.dateTime || event.start?.date}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No events found.</p>
//       )}
//     </div>
//   );
// }

// export default Calendar;
