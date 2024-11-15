import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from ''
import Register from ''
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


])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
