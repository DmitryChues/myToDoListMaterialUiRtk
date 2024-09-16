import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { STATUS_CODE, Todolist, todolistAPI } from 'api/todolistAPI'
import { FilterValues } from 'app/App'
import { RequestStatus, setLoading } from '../../app/appSlice'
import { AppThunk } from '../../app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/errorUtils'

type TodolistDomain = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}
type TodolistInitialState = {
  todolists: TodolistDomain[]
}
const initialState: TodolistInitialState = {
  todolists: [],
}

export const todolistSlice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    setTodoList(_state, action: PayloadAction<{ todolists: Todolist[] }>) {
      return {
        todolists: action.payload.todolists.map((el) => ({
          ...el,
          filter: 'all',
          entityStatus: 'idle',
        })),
      }
    },
    deleteTodoList(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.todolists.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1) state.todolists.splice(index, 1)
    },
    addTodoList(state, action: PayloadAction<{ todolist: Todolist }>) {
      state.todolists.unshift({
        ...action.payload.todolist,
        filter: 'all',
        entityStatus: 'idle',
      })
    },
    changeTodoListTitle(
      state,
      action: PayloadAction<{ todolistId: string; title: string }>
    ) {
      const index = state.todolists.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1) state.todolists[index].title = action.payload.title
    },
    changeTodoListFilter(
      state,
      action: PayloadAction<{ todolistId: string; filter: FilterValues }>
    ) {
      const index = state.todolists.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1) state.todolists[index].filter = action.payload.filter
    },
    changeEntityStatus(
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatus }>
    ) {
      const index = state.todolists.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1)
        state.todolists[index].entityStatus = action.payload.entityStatus
    },
  },
  selectors: {
    selectTodolists(state) {
      return state.todolists
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
export const { selectTodolists } = todolistSlice.selectors

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
