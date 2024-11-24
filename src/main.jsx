import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Frontend/Login.jsx'
import Register from './Frontend/Register.jsx'
import EventCategory from './Frontend/eventCategory.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'

const router = createBrowserRouter([

{
  path: '/',
  element: <Login/>
},
{
  path: '/register',
  element: <Register/>
},
{
  path: '/event-category',
  element: <EventCategory/>
}


])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
