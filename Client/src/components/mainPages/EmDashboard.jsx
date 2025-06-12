import React from 'react'
import { GlobalState } from '../../GlobalState'
import { useContext, useEffect, useState, useMemo } from 'react'
import UserAPI from '@/api/UserAPI'
import MyTeamTasks from './subcomponents/MyTeamTasks'
import MyAttendance from './AttendanceRecord'
import { motion } from 'framer-motion'
const EmDashboard = () => {
  return (
    // <div className='flex flex-col w-full p-8 gap-5'>
    //   <h2 className="text-2xl font-bold mt-2">Dashboard</h2>
    //   <MyTeamTasks />
    //   <div className='mt-5 flex flex-row justify-between w-full gap-10'>
    //     <MyAttendance />
    //   </div>
    // </div>
    <motion.div 
      className='flex flex-col w-full p-8 gap-5'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mt-2 text-gray-800">Employee Dashboard</h2>
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-white">Welcome to EmpFlow</h3>
        <p className="text-indigo-100 mt-1">Your team tasks and attendance overview</p>
      </div>
      
      <MyTeamTasks />
      
      <div className='mt-5'>
        <MyAttendance />
      </div>
    </motion.div>
  )
}

export default EmDashboard