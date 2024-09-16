import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  STATUS_CODE,
  TaskEntity,
  TaskPriorities,
  TaskStatuses,
  todolistAPI,
  UpdateTaskModel,
} from 'api/todolistAPI'
import { RequestStatus, setLoading } from 'app/appSlice'
import { AppRootState, AppThunk } from 'app/store'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/errorUtils'
import { addTodoList, deleteTodoList, setTodoList } from './todolistsSlice'

export type TasksState = {
  [key: string]: TaskDomain[]
}
const initialState: TasksState = {}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(
      state,
      action: PayloadAction<{ todolistId: string; tasks: TaskEntity[] }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
        ...task,
        entityStatus: 'idle',
      }))
    },
    addTask(state, action: PayloadAction<{ task: TaskEntity }>) {
      const tasks = state[action.payload.task.todoListId]
      tasks.unshift({ ...action.payload.task, entityStatus: 'idle' })
    },
    deleteTask(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    },
    updateTask(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        model: UpdateTaskDomainModel
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const task = tasks.find((task) => task.id === action.payload.taskId)
      if (task) {
        Object.assign(task, action.payload.model)
      }
    },
    changeEntityTaskStatus(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        entityTaskStatus: RequestStatus
      }>
    ) {
      const tasks = state[action.payload.todolistId]
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
        state[action.payload.todolist.id] = []
      })
      .addCase(setTodoList, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(deleteTodoList, (state, action) => {
        delete state[action.payload.todolistId]
      })
  },
  selectors: {
    selectTasks(state) {
      return state
    },
  },
})

export const {
  addTask,
  changeEntityTaskStatus,
  deleteTask,
  setTasks,
  updateTask,
} = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors

export const getTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(setTasks({ todolistId, tasks: res.data.items }))
        dispatch(setLoading({ status: 'succeeded' }))
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err)
      })
  }

export const addTaskTC =
  (todolistId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .addTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTask({ task: res.data.data.item }))
          dispatch(setLoading({ status: 'succeeded' }))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(dispatch, err)
      })
  }
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
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(deleteTask({ todolistId, taskId }))
          dispatch(setLoading({ status: 'succeeded' }))
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
export const updateTaskTC =
  (
    todolistId: string,
    taskId: string,
    domainModel: UpdateTaskDomainModel
  ): AppThunk =>
  (dispatch, getState: () => AppRootState) => {
    dispatch(setLoading({ status: 'loading' }))
    const task = getState().tasks[todolistId].find((el) => el.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModel = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel,
      }
      todolistAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === STATUS_CODE.SUCCESS) {
            dispatch(updateTask({ todolistId, taskId, model: domainModel }))
            dispatch(setLoading({ status: 'succeeded' }))
          } else {
            handleServerAppError(dispatch, res.data)
          }
        })
        .catch((err) => {
          handleServerNetworkError(dispatch, err)
        })
    }
  }

export type TaskDomain = TaskEntity & {
  entityStatus: RequestStatus
}

type UpdateTaskDomainModel = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
