// import React from 'react'
// import Pages from './components/mainPages/Pages'
// import { DataProvider } from './GlobalState'
// import { BrowserRouter as Router } from 'react-router-dom'
// const App = () => {
//   return (
//     <DataProvider>
//       <Router>
//           <Pages />
//       </Router>
//     </DataProvider>
//   )
// }

// export default App
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DataProvider, GlobalState } from './GlobalState'
import Layout from './components/Layout'
import Login from './components/mainPages/Login-and-Signup/Login'
import ManDashboard from './components/mainPages/ManDashboard'
import EmDashboard from './components/mainPages/EmDashboard'
import MyTasks from './components/mainPages/MyTasks'
import PrivateRoute from './utils/PrivateRoute.jsx'
import { ThemeProvider } from './components/ui/theme-provider'
import { useContext } from 'react'
import TicketManagement from './components/mainPages/TicketManagement'

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Layout>
                    <BaseDashboard />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <PrivateRoute>
                  <Layout>
                    <MyTasks />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
            path="/tickets" 
            element={
                <PrivateRoute>
                  <Layout>
                    <TicketManagement />
                  </Layout>
                </PrivateRoute>
              } 
            />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

// Component to decide which dashboard to render based on user role
function BaseDashboard() {
  const  state  = useContext(GlobalState);
  const role = state.role[0];

  return role === 'Team Manager' ? <ManDashboard /> : <EmDashboard />;
}

export default App;