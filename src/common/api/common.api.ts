import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': 'a44c1381-6c4f-4bc0-806c-d40f018b99d5',
  },
})
