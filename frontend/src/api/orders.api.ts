import apiClient from './client'
import type { Order, PageResponse, PlaceOrderRequest } from '@/types/order.types'

export const ordersApi = {
  placeOrder: async (data: PlaceOrderRequest): Promise<Order> => {
    const res = await apiClient.post('/orders', data)
    return res.data.data
  },

  getOrders: async (page = 0): Promise<PageResponse<Order>> => {
    const res = await apiClient.get('/orders', { params: { page, size: 10 } })
    return res.data.data
  },

  getOrder: async (id: string): Promise<Order> => {
    const res = await apiClient.get(`/orders/${id}`)
    return res.data.data
  },
}
