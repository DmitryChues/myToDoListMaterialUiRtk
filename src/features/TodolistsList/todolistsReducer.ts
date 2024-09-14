import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { STATUS_CODE, todolistAPI, TodolistType } from 'api/todolistAPI'
import { FilterValuesType } from 'app/App'
import { RequestStatus, setLoading } from '../../app/appReducer'
import { AppThunk } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/errorUtils'

const initialState: TodolistDomainType[] = []

export const todolistSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    setTodoListAC(
      _state,
      action: PayloadAction<{ todolists: TodolistType[] }>
    ) {
      return action.payload.todolists.map((el) => ({
        ...el,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
    deleteTodoListAC(state, action: PayloadAction<{ todolistId: string }>) {
      return state.filter((el) => el.id !== action.payload.todolistId)
    },
    addTodoListAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      return [
        { ...action.payload.todolist, filter: 'all', entityStatus: 'idle' },
        ...state,
      ]
    },
    changeTodoListTitleAC(
      state,
      action: PayloadAction<{ todolistId: string; title: string }>
    ) {
      return state.map((el) =>
        el.id === action.payload.todolistId
          ? { ...el, title: action.payload.title }
          : el
      )
    },
    changeTodoListFilterAC(
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>
    ) {
      return state.map((el) =>
        el.id === action.payload.todolistId
          ? { ...el, filter: action.payload.filter }
          : el
      )
    },
    changeEntityStatus(
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatus }>
    ) {
      return state.map((el) =>
        el.id === action.payload.todolistId
          ? { ...el, entityStatus: action.payload.entityStatus }
          : el
      )
    },
  },
})

export const {
  addTodoListAC,
  deleteTodoListAC,
  setTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  changeEntityStatus,
} = todolistSlice.actions

export const getTodosTC = (): AppThunk => (dispatch) => {
  dispatch(setLoading({ status: 'loading' }))
  todolistAPI
    .getTodos()
    .then((res) => {
      dispatch(setTodoListAC({ todolists: res.data }))
      dispatch(setLoading({ status: 'succeeded' }))
    })
    .catch((err) => {
      handleServerNetworkError(dispatch, err)
    })
}

export const addTodoListTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .addTodos(title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTodoListAC({ todolist: res.data.data.item }))
          dispatch(setLoading({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err)
      })
  }
export const changeTodoListTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .updateTodos(title, todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(changeTodoListTitleAC({ todolistId, title }))
          dispatch(setLoading({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err)
      })
  }
export const deleteTodoListTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    dispatch(changeEntityStatus({ todolistId, entityStatus: 'loading' }))
    todolistAPI
      .deleteTodos(todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(deleteTodoListAC({ todolistId }))
          dispatch(setLoading({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        dispatch(changeEntityStatus({ todolistId, entityStatus: 'idle' }))
        handleServerNetworkError(dispatch, err)
      })
  }
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}
export type TodolistActionsType =
  | DeleteTodoListACType
  | AddTodoListACType
  | SetTodosACType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | ReturnType<typeof changeEntityStatus>

export type SetTodosACType = ReturnType<typeof setTodoListAC>
export type DeleteTodoListACType = ReturnType<typeof deleteTodoListAC>
export type AddTodoListACType = ReturnType<typeof addTodoListAC>
