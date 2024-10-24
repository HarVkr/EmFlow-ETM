import React from 'react'
import Sidebar from '../Sidebar'
import AssignTasks from './subcomponents/AssignTasks'
import UpdateTasks from './subcomponents/UpdateTasks'
import EventCreation from './subcomponents/EventCreation'
import GlobalState from '../../GlobalState/'
import { useContext } from 'react'
const MyTasks = () => {
  const state = useContext(GlobalState);
  const role = state.role[0];
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <h1 className="text-2xl font-bold mb-0 mt-7 ml-7">My Tasks</h1>
        {role === 'Team Manager' ? <AssignTasks /> : null}
        <UpdateTasks />
        <EventCreation />
      </div>
    </div>
  )
}

export default MyTasks