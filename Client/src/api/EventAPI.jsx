import React from 'react'
import api from '../utils/axios';
const EventAPI = (token) => {
  const getEvents = async () => {
    try{
      console.log("Getting Events...");
      const res = await api.get('https://emp-flow-etm-u6a2.vercel.app/events/get-events', {headers: { Authorization: `Bearer ${token}` }});
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