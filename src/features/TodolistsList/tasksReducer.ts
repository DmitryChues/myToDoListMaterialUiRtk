import {
  STATUS_CODE,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  UpdateTaskModelType,
} from 'api/todolistAPI'
import { RequestStatus, setLoading } from 'app/appReducer'
import { AppRootStateType, AppThunk } from 'app/store'
import { AxiosError } from 'axios'
import {
  handleServerAppError,
  handleServerNetworkError,
} from 'utils/errorUtils'
import {
  AddTodoListACType,
  DeleteTodoListACType,
  SetTodosACType,
} from './todolistsReducer'

const initialState: TasksStateType = {}

export const tasksReducer = (
  state = initialState,
  action: TaskActionsType
): TasksStateType => {
  const { type, payload } = action
  switch (type) {
    case 'SET-TODOLISTS': {
      const copyState = { ...state }
      action.payload.todolists.forEach((tl) => {
        copyState[tl.id] = []
      })
      return copyState
    }

    case 'SET-TASKS':
      return {
        ...state,
        [payload.todolistId]: payload.tasks.map((el) => ({
          ...el,
          entityStatus: 'idle',
        })),
      }
    case 'DELETE-TASK':
      return {
        ...state,
        [payload.todolistId]: state[payload.todolistId].filter(
          (el) => el.id !== payload.taskId
        ),
      }
    case 'ADD-TASK':
      return {
        ...state,
        [payload.task.todoListId]: [
          { ...payload.task, entityStatus: 'idle' },
          ...state[action.payload.task.todoListId],
        ],
      }
    case 'UPDATE-TASK':
      return {
        ...state,
        [payload.todolistId]: state[payload.todolistId].map((el) =>
          el.id === payload.taskId ? { ...el, ...payload.model } : el
        ),
      }
    case 'CHANGE-ENTITY-TASK-STATUS':
      return {
        ...state,
        [payload.todolistId]: state[payload.todolistId].map((el) =>
          el.id === payload.taskId
            ? { ...el, entityTaskStatus: payload.entityTaskStatus }
            : el
        ),
      }
    case 'ADD-TODOLIST':
      return { ...state, [payload.todolist.id]: [] }
    case 'DELETE-TODOLIST':
      const copyState = { ...state }
      delete copyState[payload.todolistId]
      return copyState
    default:
      return state
  }
}
export const setTasksAC = ({
  tasks,
  todolistId,
}: {
  todolistId: string
  tasks: TaskType[]
}) => ({
  type: 'SET-TASKS' as const,
  payload: { todolistId, tasks },
})
export const deleteTaskAC = ({
  todolistId,
  taskId,
}: {
  todolistId: string
  taskId: string
}) => ({
  type: 'DELETE-TASK' as const,
  payload: { todolistId, taskId },
})
export const addTaskAC = ({ task }: { task: TaskType }) => ({
  type: 'ADD-TASK' as const,
  payload: { task },
})
export const updateTaskAC = ({
  todolistId,
  taskId,
  model,
}: {
  todolistId: string
  taskId: string
  model: UpdateTaskDomainModelType
}) => ({
  type: 'UPDATE-TASK' as const,
  payload: { todolistId, taskId, model },
})
export const changeEntityTaskStatus = ({
  todolistId,
  taskId,
  entityTaskStatus,
}: {
  todolistId: string
  taskId: string
  entityTaskStatus: RequestStatus
}) => ({
  type: 'CHANGE-ENTITY-TASK-STATUS' as const,
  payload: { todolistId, entityTaskStatus, taskId },
})

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
export type TasksStateType = {
  [key: string]: TaskDomainType[]
}
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatus
}
export type TaskActionsType =
  | AddTodoListACType
  | DeleteTodoListACType
  | SetTodosACType
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof deleteTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof changeEntityTaskStatus>

type UpdateTaskDomainModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
