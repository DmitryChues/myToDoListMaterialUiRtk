import { TaskPriorities, TaskStatuses } from 'common'
import { instance } from './common.api'

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
  addTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post<Response<{ item: TaskEntity }>>(
      `/todo-lists/${todolistId}/tasks`,
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
