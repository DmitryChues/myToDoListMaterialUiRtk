import { AxiosResponse } from 'axios'
import { LoginData } from 'features/Login/Login'
import { instance } from './common.api'
import { Response } from './todolistAPI'

type User = {
  id: number
  email: string
  login: string
}

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
