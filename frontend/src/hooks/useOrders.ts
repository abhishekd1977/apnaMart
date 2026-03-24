import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders.api'
import type { PlaceOrderRequest } from '@/types/order.types'
import { useNavigate } from 'react-router-dom'

export function useOrders(page = 0) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => ordersApi.getOrders(page),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: PlaceOrderRequest) => ordersApi.placeOrder(data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate(`/orders/${order.id}`)
    },
  })
}
