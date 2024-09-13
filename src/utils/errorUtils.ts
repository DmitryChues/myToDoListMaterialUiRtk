import { Dispatch } from 'redux'
import { setLoading, setError, SetLoading, SetError } from '../app/appReducer'
import { ResponseType } from '../api/todolistAPI'

type ErrorUtilsDispatchType = Dispatch<SetLoading | SetError>

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, e: { message: string }) => {
	dispatch(setLoading('failed'))
	dispatch(setError(e.message))
}

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
	if (data.messages.length) {
		dispatch(setError(data.messages[0]))
	} else {
		dispatch(setError('something error'))
	}
	dispatch(setLoading('failed'))
}