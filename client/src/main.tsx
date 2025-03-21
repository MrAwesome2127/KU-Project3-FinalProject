import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.js'
import LandingPage from './pages/LandingPage.js'
import Dashboard from './pages/Dashboard.js'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
