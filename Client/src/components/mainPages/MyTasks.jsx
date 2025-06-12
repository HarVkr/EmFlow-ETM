import React from 'react'
import Sidebar from '../Sidebar'
import AssignTasks from './subcomponents/AssignTasks'
import UpdateTasks from './subcomponents/UpdateTasks'
import EventCreation from './subcomponents/EventCreation'
import GlobalState from '../../GlobalState'
import { useContext } from 'react'
import { motion } from 'framer-motion'
const MyTasks = () => {
  const state = useContext(GlobalState);
  const role = state.role[0];
  return (
    // <div className='flex'>
    //   <Sidebar />
    //   <div className='flex flex-col w-full'>
    //     <h1 className="text-2xl font-bold mb-0 mt-7 ml-7">My Tasks</h1>
    //     {role === 'Team Manager' ? <AssignTasks /> : null}
    //     <UpdateTasks />
    //     <EventCreation />
    //   </div>
    // </div>
    <motion.div 
      className='flex flex-col w-full'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Task and Events Management</h1>
        <p className="text-indigo-100 mt-1">Manage and update your tasks and events efficiently</p>
      </div>
      
      {/* {role === 'Team Manager' ? <AssignTasks /> : null}
      <UpdateTasks />
      <EventCreation /> */}
      <div className="px-6 py-4">  {/* Add padding for better spacing */}
        {role === 'Team Manager' ? <AssignTasks /> : null}
        <UpdateTasks />
        <EventCreation />
      </div>
    </motion.div>
  )
}

export default MyTasks