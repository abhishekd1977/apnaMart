export interface OrderItem {
  id: string
  bookId: string
  title: string
  author: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  discountAmount: number
  shippingAmount: number
  finalAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: Record<string, string>
  notes: string | null
  items: OrderItem[]
  orderedAt: string
}

export interface PlaceOrderRequest {
  shippingAddress: Record<string, string>
  paymentMethod: string
  notes?: string
}
