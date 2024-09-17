import {
  combineReducers,
  configureStore,
  ThunkAction,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit'
import { authSlice } from 'features/Login/authSlice'
import { tasksSlice } from 'features/TodolistsList/tasksSlice'
import { todolistSlice } from 'features/TodolistsList/todolistsSlice'
import { useDispatch } from 'react-redux'
import { appSlice } from './appSlice'

const rootReducer = combineReducers({
  [tasksSlice.reducerPath]: tasksSlice.reducer,
  [todolistSlice.reducerPath]: todolistSlice.reducer,
  [appSlice.reducerPath]: appSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
})

export const store = configureStore({ reducer: rootReducer })

export type AppRootState = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootState, unknown, UnknownAction>

export type AppThunk<Return = void> = ThunkAction<
  Return,
  AppRootState,
  unknown,
  UnknownAction
>

export const useAppDispatch = () => useDispatch<AppDispatch>()
//export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector

// @ts-ignore
window.store = store
