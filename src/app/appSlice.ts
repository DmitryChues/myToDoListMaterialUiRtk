import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

type AppInitialState = {
  isInitialized: boolean
  status: RequestStatus
  error: null | string
}
const initialState: AppInitialState = {
  isInitialized: false,
  status: 'idle',
  error: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatus }>) {
      state.status = action.payload.status
    },
    setError(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error
    },
    setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized
    },
  },
  selectors: {
    selectAppError(state) {
      return state.error
    },
    selectAppStatus(state) {
      return state.status
    },
    selectAppInitialized(state) {
      return state.isInitialized
    },
  },
})

export const { setError, setIsInitialized, setAppStatus } = appSlice.actions
export const { selectAppError, selectAppInitialized, selectAppStatus } =
  appSlice.selectors
