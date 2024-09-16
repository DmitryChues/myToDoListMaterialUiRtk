import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI, STATUS_CODE } from 'api/todolistAPI'
import { setIsInitialized, setLoading } from 'app/appSlice'
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
    dispatch(setLoading({ status: 'loading' }))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
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
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
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
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
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
