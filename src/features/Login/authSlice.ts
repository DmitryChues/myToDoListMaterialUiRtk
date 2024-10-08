import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAppStatus, setIsInitialized } from 'app/appSlice'
import { AppThunk } from 'app/store'
import {
  authAPI,
  handleServerAppError,
  handleServerNetworkError,
  STATUS_CODE,
} from 'common'
import { clearTodolistsData } from 'features/TodolistsList/todolistsSlice'
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
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  selectors: {
    selectIsLoggedIn(state) {
      return state.isLoggedIn
    },
  },
})

export const { setIsLoggedIn } = authSlice.actions
export const { selectIsLoggedIn } = authSlice.selectors

export const loginTC =
  (data: LoginData): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          dispatch(setAppStatus({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((e) => {
        handleServerNetworkError(dispatch, e)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus({ status: 'loading' }))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        dispatch(setAppStatus({ status: 'succeeded' }))
        dispatch(clearTodolistsData())
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
}

export const meTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus({ status: 'loading' }))
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
        dispatch(setAppStatus({ status: 'succeeded' }))
      } else {
        handleServerAppError(dispatch, res.data)
      }
    })
    .catch((e) => {
      handleServerNetworkError(dispatch, e)
    })
    .finally(() => {
      dispatch(setIsInitialized({ isInitialized: true }))
    })
}
