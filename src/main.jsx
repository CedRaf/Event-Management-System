import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Frontend/Pages/Login.jsx'
import Register from './Frontend/Pages/Register.jsx'
import EventCategory from './Frontend/Pages/EventCategoryList.jsx'
import CreateEvent from './Frontend/Add/AddEvent.jsx'
import EventList from './Frontend/Pages/EventList.jsx'
import EditEventCategory from './Frontend/Edit/EditEventCategory.jsx'
import EditEvent from './Frontend/Edit/EditEvent.jsx'
import Event from './Frontend/Pages/Event.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
<<<<<<< Updated upstream
=======
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import './sidebar.css'
import './catList.css'
>>>>>>> Stashed changes
import { GoogleOAuthProvider } from '@react-oauth/google';
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
},
{
  path:'/editEvent',
  element:<EditEvent/>
},
{
  path:'/event',
  element:<Event/>
}

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="769574372190-iko3inrr1e3r6ttdh9ogtigf3dm8ubs4.apps.googleusercontent.com">
    <RouterProvider router={router}/>
    </GoogleOAuthProvider>
    
  </React.StrictMode>,
)

