import React from 'react'
import Login from './Login-and-Signup/Login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import MyTasks from './MyTasks'
const Pages = () => {
  return (
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/tasks' element={<MyTasks/>}/>
      </Routes>
  )
}

export default Pages