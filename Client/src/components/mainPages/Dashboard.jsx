import React, { useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import Sidebar from '../Sidebar';
import { Button } from '../ui/button';
import ManDashboard from './ManDashboard';
import EmDashboard from './EmDashboard';
const Dashboard = () => {
    const state = useContext(GlobalState);
    console.log(state);
    const [tasks] = state.tasks;
    const [events] = state.events;
    const role = state.role[0];
    console.log("Role: ", role);
    
    console.log("Tasks: ", tasks);
    console.log("Events: ", events);
    
  return (
    <div className='flex'>
      <Sidebar/>
      {role === 'Team Manager' ? <ManDashboard /> : <EmDashboard />}
    </div>
  )
}

export default Dashboard