import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addTaskTC, getTasksTC } from 'features/TodolistsList/tasksSlice'
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
  extraReducers(builder) {
    builder
      .addCase(getTasksTC.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(getTasksTC.fulfilled, (state, _action) => {
        state.status = 'succeeded'
      })
      .addCase(addTaskTC.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(addTaskTC.fulfilled, (state, _action) => {
        state.status = 'succeeded'
      })
  },
})

export const { setError, setIsInitialized, setAppStatus } = appSlice.actions
export const { selectAppError, selectAppInitialized, selectAppStatus } =
  appSlice.selectors
