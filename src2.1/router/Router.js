import React from 'react'
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Seize from './Seize'
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/index' element={<Seize><Home/></Seize>}></Route>

        <Route path='/' element={<Navigate to='/login' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
