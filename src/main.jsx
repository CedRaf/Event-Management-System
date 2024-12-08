import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Frontend/Pages/Login.jsx'
import OTP from './Frontend/Pages/OTP.jsx'
import RecoveredPassword from './Frontend/Pages/RecoveredPassword.jsx'
import ResetPassword from './Frontend/Pages/ResetPassword.jsx'
import Register from './Frontend/Pages/Register.jsx'
import EventCategory from './Frontend/Pages/EventCategoryList.jsx'
import CreateEvent from './Frontend/Add/AddEvent.jsx'
import EventList from './Frontend/Pages/EventList.jsx'
import EditEventCategory from './Frontend/Edit/EditEventCategory.jsx'
import EditEvent from './Frontend/Edit/EditEvent.jsx'
import Event from './Frontend/Pages/Event.jsx'
import RSVPList from './Frontend/Pages/RSVPList.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import Calendar from './Frontend/Pages/Calendar.jsx'




const router = createBrowserRouter([

{
  path: '/',
  element: <Login/>
},
{
  path: '/otp',
  element: <OTP/>
},
{
  path: '/authenticate/reset-password',
  element: <ResetPassword/>
},
{
  path: '/recoveredPassword',
  element: <RecoveredPassword/>
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
},
{
  path:'/rsvpList',
  element:<RSVPList/>
},
{
  path: 'calendar',
  element: <Calendar/>
}

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="769574372190-iko3inrr1e3r6ttdh9ogtigf3dm8ubs4.apps.googleusercontent.com">
      {/* <RecoveryProvider> */}
    <RouterProvider router={router}/>
    {/* </RecoveryProvider> */}
    </GoogleOAuthProvider>

  </React.StrictMode>,
)

