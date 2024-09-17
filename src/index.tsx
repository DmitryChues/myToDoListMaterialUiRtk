import { createTheme, ThemeProvider } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from './app/App'
import { store } from './app/store'
import { ErrorPage } from './common'
import { Login } from './features/Login/Login'
import { TodolistsList } from './features/TodolistsList/TodolistsList'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40',
    },
    secondary: {
      main: '#8c9eff',
    },
    error: {
      main: '#cf0000',
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Navigate to='/404' />,
    children: [
      {
        index: true,
        element: <Navigate to='/todolists' />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/todolists',
        element: <TodolistsList />,
      },
    ],
  },
  {
    path: '/404',
    element: <ErrorPage />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </ThemeProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
