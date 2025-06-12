import React from 'react'
import api from '../utils/axios';
const EventAPI = (token) => {
  const getEvents = async () => {
    try{
      console.log("Getting Events...");
      const res = await api.get('/events/get-events', {headers: { Authorization: `Bearer ${token}` }});
      console.log(res.data);
      return res.data;
    }
    catch(err){
      console.error("Error getting events: ", err);
      return null;
    }
  };
  const createEvent = async (event) => {
    try{
      console.log("Creating Event...");
      const res = await api.post('/events/create-event', event, {headers: { Authorization: `Bearer ${token}` }});
      console.log(res.data);
      return res.data;
    }
    catch(err){
      console.error("Error creating event: ", err);
      return null;
    }
  }

  return {getEvents, createEvent};
}

export default EventAPI