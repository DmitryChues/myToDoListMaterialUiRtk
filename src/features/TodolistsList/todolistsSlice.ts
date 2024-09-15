import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { STATUS_CODE, Todolist, todolistAPI } from 'api/todolistAPI'
import { FilterValues } from 'app/App'
import { RequestStatus, setLoading } from '../../app/appSlice'
import { AppThunk } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/errorUtils'

const initialState: TodolistDomain[] = []

export const todolistSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    setTodoList(_state, action: PayloadAction<{ todolists: Todolist[] }>) {
      return action.payload.todolists.map((el) => ({
        ...el,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
    deleteTodoList(state, action: PayloadAction<{ todolistId: string }>) {
      return state.filter((el) => el.id !== action.payload.todolistId)
    },
    addTodoList(state, action: PayloadAction<{ todolist: Todolist }>) {
      return [
        { ...action.payload.todolist, filter: 'all', entityStatus: 'idle' },
        ...state,
      ]
    },
    changeTodoListTitle(
      state,
      action: PayloadAction<{ todolistId: string; title: string }>
    ) {
      return state.map((el) =>
        el.id === action.payload.todolistId
          ? { ...el, title: action.payload.title }
          : el
      )
    },
    changeTodoListFilter(
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValues }>
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
  addTodoList,
  deleteTodoList,
  setTodoList,
  changeTodoListFilter,
  changeTodoListTitle,
  changeEntityStatus,
} = todolistSlice.actions

export const getTodosTC = (): AppThunk => (dispatch) => {
  dispatch(setLoading({ status: 'loading' }))
  todolistAPI
    .getTodos()
    .then((res) => {
      dispatch(setTodoList({ todolists: res.data }))
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
          dispatch(addTodoList({ todolist: res.data.data.item }))
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
          dispatch(changeTodoListTitle({ todolistId, title }))
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
          dispatch(deleteTodoList({ todolistId }))
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
export type TodolistDomain = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}
