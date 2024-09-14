import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth/>} />
        <Route path='/chat' element={<Auth/>} />
        <Route path='/profile' element={<Auth/>} />
        <Route path='*' element={<Navigate to="/auth"/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
