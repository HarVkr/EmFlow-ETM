import React from 'react'
import Pages from './components/mainPages/Pages'
import { DataProvider } from './GlobalState'
import { BrowserRouter as Router } from 'react-router-dom'
const App = () => {
  return (
    <DataProvider>
      <Router>
          <Pages />
      </Router>
    </DataProvider>
  )
}

export default App