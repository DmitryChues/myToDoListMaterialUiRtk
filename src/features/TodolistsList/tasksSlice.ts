import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterValues } from 'app/App'
import { RequestStatus, setAppStatus } from 'app/appSlice'
import { AppThunk } from 'app/store'
import {
  handleServerAppError,
  handleServerNetworkError,
  STATUS_CODE,
  TaskEntity,
  TaskPriorities,
  TaskStatuses,
  todolistAPI,
  UpdateTaskModel,
} from 'common'
import { createAppAsyncThunk } from 'common/hooks/useAppAsyncThunk'
import { addTodoList, deleteTodoList, setTodoList } from './todolistsSlice'

export type TaskDomain = TaskEntity & {
  entityStatus: RequestStatus
}
export type TasksState = {
  tasks: Record<string, TaskDomain[]>
}
const initialState: TasksState = {
  tasks: {},
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    deleteTask(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
      }>
    ) {
      const tasks = state.tasks[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    },
    changeEntityTaskStatus(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        entityTaskStatus: RequestStatus
      }>
    ) {
      const tasks = state.tasks[action.payload.todolistId]
      const index = tasks.findIndex(
        (todo) => todo.id === action.payload.todolistId
      )
      if (index !== -1)
        tasks[index].entityStatus = action.payload.entityTaskStatus
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodoList, (state, action) => {
        state.tasks[action.payload.todolist.id] = []
      })
      .addCase(setTodoList, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.tasks[tl.id] = []
        })
      })
      .addCase(deleteTodoList, (state, action) => {
        delete state.tasks[action.payload.todolistId]
      })
      .addCase(getTasksTC.fulfilled, (state, action) => {
        state.tasks[action.payload.todolistId] = action.payload.tasks.map(
          (task) => ({
            ...task,
            entityStatus: 'idle',
          })
        )
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        const tasks = state.tasks[action.payload.task.todoListId]
        tasks.unshift({ ...action.payload.task, entityStatus: 'idle' })
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state.tasks[action.payload.todolistId]
        const task = tasks.find((task) => task.id === action.payload.taskId)
        if (task) {
          Object.assign(task, action.payload.model)
        }
      })
  },
  selectors: {
    selectFilteredTask(state, filter: FilterValues, todolistId: string) {
      switch (filter) {
        case 'active':
          return state.tasks[todolistId].filter(
            (t) => t.status === TaskStatuses.New
          )
        case 'completed':
          return state.tasks[todolistId].filter(
            (t) => t.status === TaskStatuses.Completed
          )
        default:
          return state.tasks[todolistId]
      }
    },
  },
})

export const { changeEntityTaskStatus, deleteTask } = tasksSlice.actions
export const { selectFilteredTask } = tasksSlice.selectors

export const getTasksTC = createAppAsyncThunk<
  {
    tasks: TaskEntity[]
    todolistId: string
  },
  string
>('tasks/fetchTasks', async (todolistId, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  try {
    const res = await todolistAPI.getTasks(todolistId)
    return { todolistId, tasks: res.data.items }
  } catch (err) {
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
export const addTaskTC = createAppAsyncThunk<
  { task: TaskEntity },
  { todolistId: string; title: string }
>('tasks/addTask', async ({ title, todolistId }, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi
  try {
    const res = await todolistAPI.addTask(todolistId, title)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      const task = res.data.data.item
      return { task }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(dispatch, err)
    return rejectWithValue(null)
  }
})
export const deleteTasksTC =
  (todolistId: string, taskId: string): AppThunk =>
  (dispatch) => {
    dispatch(
      changeEntityTaskStatus({
        todolistId,
        taskId,
        entityTaskStatus: 'loading',
      })
    )
    dispatch(setAppStatus({ status: 'loading' }))
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(deleteTask({ todolistId, taskId }))
          dispatch(setAppStatus({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        dispatch(
          changeEntityTaskStatus({
            todolistId,
            taskId,
            entityTaskStatus: 'idle',
          })
        )
        handleServerNetworkError(dispatch, err)
      })
  }

type UpdateTaskArg = {
  todolistId: string
  taskId: string
  model: UpdateTaskDomainModel
}
export const updateTaskTC = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>(
  'tasks/updateTask',
  async ({ todolistId, taskId, model }, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi
    const task = getState().tasks.tasks[todolistId].find(
      (el) => el.id === taskId
    )
    if (task) {
      const apiModel: UpdateTaskModel = {
        ...task,
        ...model,
      }
      try {
        const res = await todolistAPI.updateTask(todolistId, taskId, apiModel)
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          return { todolistId, taskId, model }
        } else {
          handleServerAppError(dispatch, res.data)
          return rejectWithValue(null)
        }
      } catch (err) {
        handleServerNetworkError(dispatch, err)
        return rejectWithValue(null)
      }
    } else {
      return rejectWithValue(null)
    }
  }
)
type UpdateTaskDomainModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
