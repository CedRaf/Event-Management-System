import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createEventCategory = async (eventData) => {
  return axios.post(`${API_BASE_URL}/eventCategory/create`, eventData);
};

export const deleteEventCategory = async (eventID) => {
  return axios.delete(`${API_BASE_URL}/eventCategory/delete`, { data: { eventID } });
};

export const editEventCategory = async (eventID, updatedData) => {
  return axios.put(`${API_BASE_URL}/eventCategory/edit/${eventID}`, updatedData);
};


export const getAllEventsCategory = async () => {
  return axios.get(`${API_BASE_URL}/eventCategory/all`);
};
