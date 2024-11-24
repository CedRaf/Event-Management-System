import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createEvent = async (eventData) => { //requires userID, thus insert stored user in localStorage
  return axios.post(`${API_BASE_URL}/events/create`, eventData, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};

export const deleteEvent = async (eventID) => { //does not need userID as all events are not distinguished by user
  return axios.delete(`${API_BASE_URL}/events/delete`, { headers: {
    Authorization: `Bearer: ${token}`}, data: { eventID } });
};

export const editEvent = async (eventID, updatedData) => { 
  return axios.put(`${API_BASE_URL}/events/edit/${eventID}`, updatedData, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};


export const getAllEvents = async (userID) => {
  return axios.get(`${API_BASE_URL}/events/all/${userID}`, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};
