import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState: InitialState = {
  isInitialized: false,
  status: 'idle',
  error: null,
}
type InitialState = {
  isInitialized: boolean
  status: RequestStatus
  error: null | string
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<{ status: RequestStatus }>) {
      state.status = action.payload.status
    },
    setError(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error
    },
    setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const { setError, setIsInitialized, setLoading } = appSlice.actions
