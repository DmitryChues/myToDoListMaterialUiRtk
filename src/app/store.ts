import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AuthActionsType, authReducer } from '../features/Login/authReducer'
import {
  TaskActionsType,
  tasksReducer,
} from '../features/TodolistsList/tasksReducer'
import {
  TodolistActionsType,
  todolistReducer,
} from '../features/TodolistsList/todolistsReducer'
import { AppActionsType, appReducer } from './appReducer'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolist: todolistReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export type CommonActionsType =
  | TodolistActionsType
  | TaskActionsType
  | AuthActionsType
  | AppActionsType

export type AppThunkDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  CommonActionsType
>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  CommonActionsType
>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector

// @ts-ignore
window.store = store
