import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  STATUS_CODE,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  UpdateTaskModelType,
} from 'api/todolistAPI'
import { RequestStatus, setLoading } from 'app/appSlice'
import { AppRootStateType, AppThunk } from 'app/store'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/errorUtils'
import {
  addTodoListAC,
  deleteTodoListAC,
  setTodoListAC,
} from './todolistsSlice'

export type TasksStateType = {
  [key: string]: TaskDomainType[]
}
const initialState: TasksStateType = {}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksAC(
      state,
      action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: action.payload.tasks.map((el) => ({
          ...el,
          entityStatus: 'idle',
        })),
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      return {
        ...state,
        [action.payload.task.todoListId]: [
          { ...action.payload.task, entityStatus: 'idle' },
          ...state[action.payload.task.todoListId],
        ],
      }
    },
    deleteTaskAC(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(
          (el) => el.id !== action.payload.taskId
        ),
      }
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        model: UpdateTaskDomainModelType
      }>
    ) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(
          (el) =>
            el.id === action.payload.taskId
              ? { ...el, ...action.payload.model }
              : el
        ),
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
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(
          (el) =>
            el.id === action.payload.taskId
              ? { ...el, entityTaskStatus: action.payload.entityTaskStatus }
              : el
        ),
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodoListAC, (state, action) => {
        return { ...state, [action.payload.todolist.id]: [] }
      })
      .addCase(setTodoListAC, (state, action) => {
        const copyState = { ...state }
        action.payload.todolists.forEach((tl) => {
          copyState[tl.id] = []
        })
        return copyState
      })
      .addCase(deleteTodoListAC, (state, action) => {
        const copyState = { ...state }
        delete copyState[action.payload.todolistId]
        return copyState
      })
  },
})

export const {
  addTaskAC,
  changeEntityTaskStatus,
  deleteTaskAC,
  setTasksAC,
  updateTaskAC,
} = tasksSlice.actions

export const getTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading({ status: 'loading' }))
    todolistAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(setTasksAC({ todolistId, tasks: res.data.items }))
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
          dispatch(addTaskAC({ task: res.data.data.item }))
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
          dispatch(deleteTaskAC({ todolistId, taskId }))
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
    domainModel: UpdateTaskDomainModelType
  ): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    dispatch(setLoading({ status: 'loading' }))
    const task = getState().tasks[todolistId].find((el) => el.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
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
            dispatch(updateTaskAC({ todolistId, taskId, model: domainModel }))
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

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatus
}

type UpdateTaskDomainModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
