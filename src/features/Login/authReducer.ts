import { authAPI, STATUS_CODE } from 'api/todolistAPI'
import { setIsInitialized, setLoading } from 'app/appReducer'
import { AppThunk } from 'app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/errorUtils'
import { LoginData } from './Login'

const initialState = {
  isLoggedIn: false,
}

type InitialState = typeof initialState

export const authReducer = (
  state = initialState,
  action: AuthActionsType
): InitialState => {
  const { type, payload } = action
  switch (type) {
    case 'LOGIN/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: payload.isLoggedIn }
    default:
      return state
  }
}

export const setIsLoggedInAC = ({ isLoggedIn }: { isLoggedIn: boolean }) => ({
  type: 'LOGIN/SET-IS-LOGGED-IN' as const,
  payload: { isLoggedIn },
})

export const loginTC =
  (data: LoginData): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
        dispatch(setLoading({ status: 'succeeded' }))
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setLoading({ status: 'loading' }))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedInAC({ isLoggedIn: false }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
      dispatch(setLoading({ status: 'succeeded' }))
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const meTC = (): AppThunk => (dispatch) => {
  dispatch(setLoading({ status: 'loading' }))
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
      dispatch(setLoading({ status: 'succeeded' }))
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
    .finally(() => {
      dispatch(setIsInitialized({ isInitialized: true }))
    })
}

export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
