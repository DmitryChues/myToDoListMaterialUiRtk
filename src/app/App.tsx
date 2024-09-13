import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CustomizedSnackbars from 'components/ErrorSnackbar/ErrorSnackbar'
import { logoutTC, meTC } from 'features/Login/authReducer'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { RequestStatus } from './appReducer'
import { useAppDispatch, useAppSelector } from './store'

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}
export type TasksType = {
  [key: string]: TaskType[]
}

function App() {
  const dispatch = useAppDispatch()
  const status = useAppSelector<RequestStatus>((state) => state.app.status)
  const isInitialized = useAppSelector<boolean>(
    (state) => state.app.isInitialized
  )
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn)

  const logOut = () => {
    dispatch(logoutTC())
  }

  useEffect(() => {
    dispatch(meTC())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <CircularProgress />
      </div>
    )
  }
  return (
    <div className='App'>
      <AppBar
        position='static'
        sx={{ marginBottom: '24px' }}
      >
        <Container sx={{ '.MuiToolbar-root': { padding: '0px' } }}>
          <Toolbar>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              component='div'
              sx={{ flexGrow: 1 }}
            >
              Todos
            </Typography>
            {isLoggedIn && (
              <Button
                onClick={logOut}
                color='inherit'
              >
                sign out
              </Button>
            )}
          </Toolbar>
        </Container>
        {status === 'loading' && <LinearProgress color='secondary' />}
      </AppBar>
      <Container>
        <Outlet />
        <CustomizedSnackbars />
      </Container>
    </div>
  )
}

export default App
