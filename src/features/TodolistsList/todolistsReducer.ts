import { FilterValuesType } from '../../app/App'
import { todolistAPI, TodolistType } from '../../api/todolistAPI'
import {
  RequestStatus,
  SetError,
  setLoading,
  SetLoading,
} from '../../app/appReducer'
import {
  handleServerAppError,
  handleServerNetworkError,
} from '../../utils/errorUtils'
import { AppThunk } from '../../app/store'

const initialState: TodolistDomainType[] = []

enum STATUS_CODE {
  SUCCESS = 0,
  ERROR = 1,
  RECAPTCHA_ERROR = 10,
}

export const todolistReducer = (
  state = initialState,
  action: TodolistActionsType
): TodolistDomainType[] => {
  const { type, payload } = action
  switch (type) {
    case 'SET-TODOLISTS':
      return payload.todolists.map((el) => ({
        ...el,
        filter: 'all',
        entityStatus: 'idle',
      }))
    case 'DELETE-TODOLIST':
      return state.filter((el) => el.id !== payload.todolistId)
    case 'ADD-TODOLIST':
      return [
        { ...payload.todolist, filter: 'all', entityStatus: 'idle' },
        ...state,
      ]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map((el) =>
        el.id === payload.todolistId ? { ...el, title: payload.title } : el
      )
    case 'CHANGE-TODOLIST-FILTER':
      return state.map((el) =>
        el.id === payload.todolistId ? { ...el, filter: payload.filter } : el
      )
    case 'CHANGE-ENTITY-STATUS':
      return state.map((el) =>
        el.id === payload.todolistId
          ? { ...el, entityStatus: payload.entityStatus }
          : el
      )
    default:
      return state
  }
}

export const deleteTodoListAC = (todolistId: string) => ({
  type: 'DELETE-TODOLIST' as const,
  payload: { todolistId },
})
export const addTodoListAC = (todolist: TodolistType) => ({
  type: 'ADD-TODOLIST' as const,
  payload: { todolist },
})
export const changeTodoListTitleAC = (todolistId: string, title: string) => ({
  type: 'CHANGE-TODOLIST-TITLE' as const,
  payload: { todolistId, title },
})
export const changeTodoListFilterAC = (
  todolistId: string,
  filter: FilterValuesType
) => ({
  type: 'CHANGE-TODOLIST-FILTER' as const,
  payload: { todolistId, filter },
})
export const changeEntityStatus = (
  todolistId: string,
  entityStatus: RequestStatus
) => ({
  type: 'CHANGE-ENTITY-STATUS' as const,
  payload: { todolistId, entityStatus },
})
export const setTodoListAC = (todolists: TodolistType[]) => ({
  type: 'SET-TODOLISTS' as const,
  payload: { todolists },
})

export const getTodosTC = (): AppThunk => (dispatch) => {
  dispatch(setLoading('loading'))
  todolistAPI
    .getTodos()
    .then((res) => {
      dispatch(setTodoListAC(res.data))
      dispatch(setLoading('succeeded'))
    })
    .catch((err) => {
      handleServerNetworkError(dispatch, err)
    })
}
// Example Thunk with async, await
//export const _getTodosTC = (): AppThunk => async dispatch => {
//	dispatch(setLoading('loading'))
//	try {
//		const res = await todolistAPI.getTodos()
//		dispatch(setTodoListAC(res.data))
//		dispatch(setLoading('succeeded'))
//	} catch (err) {
//		if (err instanceof Error) {
//			handleServerNetworkError(dispatch, err)
//		} else {
//			handleServerNetworkError(dispatch, { message: 'Unknown error' })
//		}
//	}
//}

export const addTodoListTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(setLoading('loading'))
    todolistAPI
      .addTodos(title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTodoListAC(res.data.data.item))
          dispatch(setLoading('succeeded'))
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
    dispatch(setLoading('loading'))
    todolistAPI
      .updateTodos(title, todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(changeTodoListTitleAC(todolistId, title))
          dispatch(setLoading('succeeded'))
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
    dispatch(setLoading('loading'))
    dispatch(changeEntityStatus(todolistId, 'loading'))
    todolistAPI
      .deleteTodos(todolistId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(deleteTodoListAC(todolistId))
          dispatch(setLoading('succeeded'))
        } else {
          handleServerAppError(dispatch, res.data)
        }
      })
      .catch((err) => {
        dispatch(changeEntityStatus(todolistId, 'idle'))
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
  | SetLoading
  | SetError
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | ReturnType<typeof changeEntityStatus>

export type SetTodosACType = ReturnType<typeof setTodoListAC>
export type DeleteTodoListACType = ReturnType<typeof deleteTodoListAC>
export type AddTodoListACType = ReturnType<typeof addTodoListAC>
