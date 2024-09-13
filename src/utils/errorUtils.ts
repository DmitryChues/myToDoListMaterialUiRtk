import { ResponseType } from 'api/todolistAPI'
import { setError, SetError, setLoading, SetLoading } from 'app/appReducer'
import { Dispatch } from 'redux'

type ErrorUtilsDispatchType = Dispatch<SetLoading | SetError>

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
