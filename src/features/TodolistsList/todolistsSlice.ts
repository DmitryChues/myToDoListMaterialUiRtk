import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterValues } from 'app/App'
import { RequestStatus } from 'app/appSlice'
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
  extraReducers(builder) {
    builder
      .addCase(getTodolistsTC.fulfilled, (_state, action) => {
        return {
          todolists: action.payload.todolists.map((el) => ({
            ...el,
            filter: 'all',
            entityStatus: 'idle',
          })),
        }
      })
      .addCase(addTodoListTC.fulfilled, (state, action) => {
        state.todolists.unshift({
          ...action.payload.todolist,
          filter: 'all',
          entityStatus: 'idle',
        })
      })
      .addCase(updateTodoListTC.fulfilled, (state, action) => {
        const index = state.todolists.findIndex(
          (todo) => todo.id === action.payload.todolistId
        )
        if (index !== -1) {
          Object.assign(state.todolists[index], action.payload.model)
        }
      })
      .addCase(deleteTodoListTC.fulfilled, (state, action) => {
        const index = state.todolists.findIndex(
          (todo) => todo.id === action.payload.todolistId
        )
        if (index !== -1) state.todolists.splice(index, 1)
      })
    //.addCase(logoutTC.fulfilled)
  },
  selectors: {
    selectTodolists(state) {
      return state.todolists
    },
  },
})

export const { updateTodolist, clearTodolistsData } = todolistSlice.actions
export const { selectTodolists } = todolistSlice.selectors

export const getTodolistsTC = createAppAsyncThunk<
  { todolists: Todolist[] },
  void
>('todolists/fetchTodolists', async (_arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  try {
    const res = await todolistAPI.getTodos()
    const tasksPromises = res.data.map((todolist) => {
      return dispatch(getTasksTC(todolist.id))
    })
    await Promise.all(tasksPromises)
    return { todolists: res.data }
  } catch (err) {
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
export const addTodoListTC = createAppAsyncThunk<
  { todolist: Todolist },
  { title: string }
>('todolists/addTodolist', async ({ title }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  try {
    const res = await todolistAPI.addTodos(title)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
export const updateTodoListTC = createAppAsyncThunk<
  {
    todolistId: string
    model: UpdateTodolistDomainModel
  },
  { title: string; todolistId: string }
>('todolists/updateTodoList', async ({ title, todolistId }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  try {
    const res = await todolistAPI.updateTodos(title, todolistId)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      return { todolistId, model: { title } }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
export const deleteTodoListTC = createAppAsyncThunk<
  { todolistId: string },
  { todolistId: string }
>('todolists/deleteTodoList', async ({ todolistId }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  dispatch(updateTodolist({ todolistId, model: { entityStatus: 'loading' } }))
  try {
    const res = await todolistAPI.deleteTodos(todolistId)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      return { todolistId }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (err) {
    dispatch(updateTodolist({ todolistId, model: { entityStatus: 'idle' } }))
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
type UpdateTodolistDomainModel = Partial<TodolistDomain>
