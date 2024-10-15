
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import store from './redux/store'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes}></RouterProvider>
    </Provider>
  </React.StrictMode>
)
