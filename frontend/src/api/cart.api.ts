import apiClient from './client'
import type { Cart } from '@/types/cart.types'

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get('/cart')
    return res.data.data
  },

  addItem: async (bookId: string, quantity: number): Promise<Cart> => {
    const res = await apiClient.post('/cart/items', { bookId, quantity })
    return res.data.data
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const res = await apiClient.put(`/cart/items/${itemId}`, { quantity })
    return res.data.data
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const res = await apiClient.delete(`/cart/items/${itemId}`)
    return res.data.data
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart')
  },
}
