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
      return { ...state, status: action.payload.status }
    },
    setError(state, action: PayloadAction<{ error: null | string }>) {
      return { ...state, error: action.payload.error }
    },
    setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      return { ...state, isInitialized: action.payload.isInitialized }
    },
  },
})

export const { setError, setIsInitialized, setLoading } = appSlice.actions
