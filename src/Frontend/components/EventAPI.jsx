import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createAPI = async (newEvent) => { //requires userID, thus insert stored user in localStorage
  return axios.post(`${API_BASE_URL}/events/create`, newEvent, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};

export const deleteAPI = async (eventID) => { //does not need userID as all events are not distinguished by user
  return axios.delete(`${API_BASE_URL}/events/delete/${eventID}`, { headers: {
    Authorization: `Bearer: ${token}`} });
};

export const editEvent = async (eventID, updatedData) => { 
  return axios.put(`${API_BASE_URL}/events/edit/${eventID}`, updatedData, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};


export const getAllAPI = async (userID) => {
  return axios.get(`${API_BASE_URL}/events/all/${userID}`, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};

export const getByCategoryAPI = async (categoryID) => {
  return axios.get(`${API_BASE_URL}/events/findByCategory/${categoryID}`, {headers: {
    Authorization: `Bearer: ${token}`
        }});
};
