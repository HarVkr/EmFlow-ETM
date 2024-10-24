import React from 'react'
import { GlobalState } from '../../GlobalState'
import { useContext, useEffect, useState, useMemo } from 'react'
import UserAPI from '@/api/UserAPI'
import MyTeamTasks from './subcomponents/MyTeamTasks'
import MyAttendance from './AttendanceRecord'
const EmDashboard = () => {
  return (
    <div className='flex flex-col w-full p-8 gap-5'>
      <h2 className="text-2xl font-bold mt-2">Dashboard</h2>
      <MyTeamTasks />
      <div className='mt-5 flex flex-row justify-between w-full gap-10'>
        <MyAttendance />
      </div>
    </div>
  )
}

export default EmDashboard