import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Frontend/Pages/Login.jsx'
import Register from './Frontend/Pages/Register.jsx'
import EventCategory from './Frontend/Pages/EventCategoryList.jsx'
import CreateEvent from './Frontend/Add/AddEvent.jsx'
import EventList from './Frontend/Pages/EventList.jsx'
import EditEventCategory from './Frontend/Edit/EditEventCategory.jsx'
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
},

{
  path:'/createEvent',
  element:<CreateEvent/>
},
{
  path:'/eventList',
  element:<EventList/>
},
{
  path:'/editEventCategory',
  element:<EditEventCategory/>
}

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
