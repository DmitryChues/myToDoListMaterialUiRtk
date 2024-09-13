import { ResponseType } from 'api/todolistAPI'
import { setError, SetError, setLoading, SetLoading } from 'app/appReducer'
import { Dispatch } from 'redux'

type ErrorUtilsDispatchType = Dispatch<SetLoading | SetError>

export const handleServerNetworkError = (
  dispatch: ErrorUtilsDispatchType,
  e: { message: string }
) => {
  dispatch(setLoading('failed'))
  dispatch(setError(e.message))
}

export const handleServerAppError = <T>(
  dispatch: ErrorUtilsDispatchType,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(setError(data.messages[0]))
  } else {
    dispatch(setError('something error'))
  }
  dispatch(setLoading('failed'))
}
