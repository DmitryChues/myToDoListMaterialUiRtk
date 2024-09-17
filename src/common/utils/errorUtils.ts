import { setAppStatus, setError } from 'app/appSlice'
import axios from 'axios'
import { Response } from 'common'
import { Dispatch } from 'redux'

type ErrorUtilsDispatch = Dispatch

export const handleServerNetworkError = (
  dispatch: ErrorUtilsDispatch,
  e: unknown
) => {
  let errorMessage = 'Some error occurred'

  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(e)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = e.response?.data?.message || e?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (e instanceof Error) {
    errorMessage = `Native error: ${e.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(e)
  }
  dispatch(setAppStatus({ status: 'failed' }))
  dispatch(setError({ error: errorMessage }))
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
  dispatch(setAppStatus({ status: 'failed' }))
}
