import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { setError } from 'app/appReducer'
import { useAppDispatch, useAppSelector } from 'app/store'
import * as React from 'react'

export default function CustomizedSnackbars() {
  const error = useAppSelector((state) => state.app.error)
  const dispatch = useAppDispatch()
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setError({ error: null }))
  }

  return (
    <div>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity='error'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}
