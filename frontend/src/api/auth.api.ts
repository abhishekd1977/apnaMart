import apiClient from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth.types'

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data)
    return res.data.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data)
    return res.data.data
  },
}
