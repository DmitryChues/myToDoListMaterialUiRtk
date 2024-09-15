import { Response } from 'api/todolistAPI'
import { setError, setLoading } from 'app/appSlice'
import { Dispatch } from 'redux'

type ErrorUtilsDispatch = Dispatch

export const handleServerNetworkError = (
  dispatch: ErrorUtilsDispatch,
  e: { message: string }
) => {
  dispatch(setLoading({ status: 'failed' }))
  dispatch(setError({ error: e.message }))
}

export const handleServerAppError = <T>(
  dispatch: ErrorUtilsDispatch,
  data: Response<T>
) => {
  if (data.messages.length) {
    dispatch(setError({ error: data.messages[0] }))
  } else {
    dispatch(setError({ error: 'something error' }))
  }
  dispatch(setLoading({ status: 'failed' }))
}
