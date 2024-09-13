import axios, { AxiosResponse } from 'axios'
import { LoginData } from '../features/Login/Login'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': 'a44c1381-6c4f-4bc0-806c-d40f018b99d5',
  },
})

export const authAPI = {
  login(data: LoginData) {
    return instance.post<
      ResponseType<{ userId: number }>,
      AxiosResponse<ResponseType<{ userId: number }>>,
      LoginData
    >('/auth/login', data)
  },
  logout() {
    return instance.delete<ResponseType>('/auth/login')
  },
  me() {
    return instance.get<ResponseType<UserType>>('/auth/me')
  },
}

export const todolistAPI = {
  getTodos() {
    return instance.get<TodolistType[]>('/todo-lists')
  },
  addTodos(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('/todo-lists', {
      title,
    })
  },
  updateTodos(title: string, todoId: string) {
    return instance.put<ResponseType>(`/todo-lists/${todoId}`, { title })
  },
  deleteTodos(todoId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todoId}`)
  },
  getTasks(todoId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todoId}/tasks`)
  },
  addTask(todoId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todoId}/tasks`,
      { title }
    )
  },
  updateTask(todoId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put(`/todo-lists/${todoId}/tasks/${taskId}`, { ...model })
  },
  deleteTask(todoId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `/todo-lists/${todoId}/tasks/${taskId}`
    )
  },
}

type UserType = {
  id: number
  email: string
  login: string
}
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type ResponseType<T = {}> = {
  data: T
  fieldsErrors: string[]
  messages: string[]
  resultCode: number
}
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
