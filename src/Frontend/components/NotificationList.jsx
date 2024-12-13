import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../notification.css"
import Sidebar from './Sidebar';

function NotificationList () {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

 

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
    const getNotifications = async () => {
      if(!token && !user){ //because these arent initialized right away
        return;
      }
      try {
        
        const response = await axios.get(`http://localhost:3000/notifications/getAllNotifications/${user.userID}`, {
          headers: {
            Authorization: `Bearer: ${token}`
              }});
        if(response){ 
          setNotifications(response.data.allNotifications);
          console.log(response);
        }
        
      } catch (err) {
        setError('Error fetching the Event');
      }
    };

    getNotifications();
  }, [token, user]);

 
    const lastIndex = currentPage * notificationsPerPage;
    const firstIndex = lastIndex - notificationsPerPage;
    const currentNotifications = notifications.slice(firstIndex, lastIndex);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const markAsRead = async (notification) => {
        try {
            const response = await axios.patch(`http://localhost:3000/notifications/markAsRead/${notification.notificationID}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            if(response && response.data){
              setError(response.data.message);
              setNotifications((prevNotifications) => 
                prevNotifications.map((notification) => 
                  notification.notificationID === response.data.updatedNotification.notificationID
                    ? response.data.updatedNotification // Replace the whole notification with the updated one
                    : notification // Keep the other notifications unchanged
                )
              );
          }
          } catch (err) {
            alert('Error deleting the Event', error);
          }
    }

    const deleteNotification = async (notification) => {
        try {
            const response = await axios.delete(`http://localhost:3000/notifications/deleteNotification/${notification.notificationID}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            if(response && response.data){
              setError(response.data.message);
              setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.notificationID !== response.data.deletedNotification.notificationID));
          }
          } catch (err) {
            alert('Error deleting the Event', error);
          }
    }

    return (
      <>
      <Sidebar></Sidebar>
      <div className='noti-parent'>
      
      <div className="notification-container">
        <h2 className="title">Notifications</h2>
        {error && <p className="error-message">{error}</p>}
  
        <ul className="notification-list">
          {currentNotifications.map((notification) => (
            <li key={notification.notificationID} className="notification-item">
              <div className="notification-content">
                <p className="message">{notification.message}</p>
                <p className="status">{notification.opened ? 'Opened' : 'Unread'}</p>
              </div>
              <div className="actions">
                <button
                  className="mark-read-button"
                  onClick={() => markAsRead(notification)}
                >
                  ✉ Mark as Read
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteNotification(notification)}
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
  
        <div className="pagination">
          <button
            className="prev-button"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="next-button"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * notificationsPerPage >= notifications.length}
          >
            Next
          </button>
        </div>
      </div>
      </div>
      </>
    );
};

export default NotificationList;
