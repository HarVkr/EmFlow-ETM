import api from '../utils/axios';
import React from 'react'
import { useState } from 'react';
const TaskAPI = (token) => {
  const createTask = async (task) => {
    try{
      console.log("Creating Task...");
      const res = await api.post('https://emp-flow-etm-u6a2.vercel.app/tasks/create-task',  task , {headers: { Authorization: `Bearer ${token}` }});
      return res.data;
    }
    catch(err){
      console.error("Error creating task: ", err);
      return null;
    }
  };
  const getTasks = async () => {
    try{
      console.log("Getting Tasks...");
      const res = await api.get('https://emp-flow-etm-u6a2.vercel.app/tasks/get-tasks', {headers: { Authorization: `Bearer ${token}` }});
      return res.data;
    }
    catch(err){
      console.error("Error getting tasks: ", err);
      return null;
    }
  };
  const updateTaskStatus = async (taskID, status) => {
    try{
      console.log("Updating Task Status...");
      const res = await api.put(`https://emp-flow-etm-u6a2.vercel.app/tasks/update-task-status/${taskID}`,status, {headers: { Authorization: `Bearer ${token}` }});
      return res.data;
    }
    catch(err){
      console.error("Error updating task status: ", err);
      return null;
    }
  }
  return {createTask, getTasks, updateTaskStatus};
}

export default TaskAPI;