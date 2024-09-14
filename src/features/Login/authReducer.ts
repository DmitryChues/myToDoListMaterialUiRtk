import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI, STATUS_CODE } from 'api/todolistAPI'
import { setIsInitialized, setLoading } from 'app/appReducer'
import { AppThunk } from 'app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/errorUtils'
import { LoginData } from './Login'

type InitialState = {
  isLoggedIn: boolean
}

const initialState: InitialState = {
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      return { ...state, isLoggedIn: action.payload.isLoggedIn }
    },
  },
})

export const { setIsLoggedInAC } = authSlice.actions

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
