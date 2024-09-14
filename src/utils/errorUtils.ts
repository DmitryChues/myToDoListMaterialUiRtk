import { ResponseType } from 'api/todolistAPI'
import { setError, setLoading } from 'app/appReducer'
import { Dispatch } from 'redux'

type ErrorUtilsDispatchType = Dispatch

export const handleServerNetworkError = (
  dispatch: ErrorUtilsDispatchType,
  e: { message: string }
) => {
  dispatch(setLoading({ status: 'failed' }))
  dispatch(setError({ error: e.message }))
}

export const handleServerAppError = <T>(
  dispatch: ErrorUtilsDispatchType,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(setError({ error: data.messages[0] }))
  } else {
    dispatch(setError({ error: 'something error' }))
  }
  dispatch(setLoading({ status: 'failed' }))
}
