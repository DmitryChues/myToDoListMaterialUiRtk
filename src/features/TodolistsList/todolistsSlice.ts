import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterValues } from 'app/App'
import { RequestStatus, setAppStatus } from 'app/appSlice'
import { AppThunk } from 'app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
  STATUS_CODE,
  Todolist,
  todolistAPI,
} from 'common'
import { createAppAsyncThunk } from 'common/hooks/useAppAsyncThunk'
import { getTasksTC } from './tasksSlice'

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
    setTodoLists(_state, action: PayloadAction<{ todolists: Todolist[] }>) {
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
    updateTodolist(
      state,
      action: PayloadAction<{
        todolistId: string
        model: UpdateTodolistDomainModel
      }>
    ) {
      const index = state.todolists.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1) {
        Object.assign(state.todolists[index], action.payload.model)
      }
    },
    clearTodolistsData(state, _action: PayloadAction) {
      state.todolists = []
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
  setTodoLists,
  updateTodolist,
  clearTodolistsData,
} = todolistSlice.actions
export const { selectTodolists } = todolistSlice.selectors

export const getTodolistsTC = createAppAsyncThunk<Todolist[]>(
  'todolists/fetchTodolists',
  async (_arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    try {
      const res = await todolistAPI.getTodos()
      dispatch(setTodoLists({ todolists: res.data }))
      const tasksPromises = res.data.map((todolist) => {
        return dispatch(getTasksTC(todolist.id))
      })
      await Promise.all(tasksPromises)
      return res.data
    } catch (err) {
      handleServerNetworkError(dispatch, err)
      return rejectWithValue(null)
    }
  }
)

export const addTodoListTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    todolistAPI
      .addTodos(title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTodoList({ todolist: res.data.data.item }))
          dispatch(setAppStatus({ status: 'succeeded' }))
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
    dispatch(setAppStatus({ status: 'loading' }))
    todolistAPI
      .updateTodos(title, todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(updateTodolist({ todolistId, model: { title } }))
          dispatch(setAppStatus({ status: 'succeeded' }))
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
    dispatch(setAppStatus({ status: 'loading' }))
    dispatch(updateTodolist({ todolistId, model: { entityStatus: 'loading' } }))
    todolistAPI
      .deleteTodos(todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(deleteTodoList({ todolistId }))
          dispatch(setAppStatus({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        dispatch(
          updateTodolist({ todolistId, model: { entityStatus: 'idle' } })
        )
        handleServerNetworkError(dispatch, err)
      })
  }
type UpdateTodolistDomainModel = Partial<TodolistDomain>
