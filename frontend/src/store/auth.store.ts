import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: Omit<AuthResponse, 'accessToken' | 'tokenType'> | null
  setAuth: (response: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (response) =>
        set({
          token: response.accessToken,
          user: {
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role,
          },
        }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'apnamart-auth',
    }
  )
)
