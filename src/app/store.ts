import {
  combineReducers,
  configureStore,
  UnknownAction,
} from '@reduxjs/toolkit'
import { authSlice } from 'features/Login/authReducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { tasksReducer } from '../features/TodolistsList/tasksReducer'
import { todolistSlice } from '../features/TodolistsList/todolistsReducer'
import { appSlice } from './appReducer'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  [todolistSlice.reducerPath]: todolistSlice.reducer,
  [appSlice.reducerPath]: appSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
})

export const store = configureStore({ reducer: rootReducer })

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunkDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  UnknownAction
>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  UnknownAction
>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector

// @ts-ignore
window.store = store
