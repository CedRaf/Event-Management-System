import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createEvent = async (eventData) => {
  return axios.post(`${API_BASE_URL}/events/create`, eventData);
};

export const deleteEvent = async (eventID) => {
  return axios.delete(`${API_BASE_URL}/events/delete`, { data: { eventID } });
};

export const editEvent = async (eventID, updatedData) => {
  return axios.put(`${API_BASE_URL}/events/edit/${eventID}`, updatedData);
};

export const findEvent = async (eventTitle) => {
  return axios.get(`${API_BASE_URL}/events/find/${eventTitle}`);
};

export const getAllEvents = async () => {
  return axios.get(`${API_BASE_URL}/events/all`);
};
