import axios, { AxiosResponse } from 'axios'
import { LoginData } from 'features/Login/Login'

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
      Response<{ userId: number }>,
      AxiosResponse<Response<{ userId: number }>>,
      LoginData
    >('/auth/login', data)
  },
  logout() {
    return instance.delete<Response>('/auth/login')
  },
  me() {
    return instance.get<Response<User>>('/auth/me')
  },
}

export const todolistAPI = {
  getTodos() {
    return instance.get<Todolist[]>('/todo-lists')
  },
  addTodos(title: string) {
    return instance.post<Response<{ item: Todolist }>>('/todo-lists', {
      title,
    })
  },
  updateTodos(title: string, todoId: string) {
    return instance.put<Response>(`/todo-lists/${todoId}`, { title })
  },
  deleteTodos(todoId: string) {
    return instance.delete<Response>(`/todo-lists/${todoId}`)
  },
  getTasks(todoId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todoId}/tasks`)
  },
  addTask(todoId: string, title: string) {
    return instance.post<Response<{ item: TaskEntity }>>(
      `/todo-lists/${todoId}/tasks`,
      { title }
    )
  },
  updateTask(todoId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put(`/todo-lists/${todoId}/tasks/${taskId}`, { ...model })
  },
  deleteTask(todoId: string, taskId: string) {
    return instance.delete<Response>(`/todo-lists/${todoId}/tasks/${taskId}`)
  },
}

type User = {
  id: number
  email: string
  login: string
}
export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type Response<T = {}> = {
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
export type TaskEntity = {
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
  items: TaskEntity[]
}
export type UpdateTaskModel = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export enum STATUS_CODE {
  SUCCESS = 0,
  ERROR = 1,
  RECAPTCHA_ERROR = 10,
}
