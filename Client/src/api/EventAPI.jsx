import React from 'react'
import api from '../utils/axios';
const EventAPI = (token) => {
  const getEvents = async () => {
    try{
      console.log("Getting Events...");
      const res = await api.get('http://localhost:5000/events/get-events', {headers: { Authorization: `Bearer ${token}` }});
      console.log(res.data);
      return res.data;
    }
    catch(err){
      console.error("Error getting events: ", err);
      return null;
    }
  }


  return {getEvents};
}

export default EventAPI