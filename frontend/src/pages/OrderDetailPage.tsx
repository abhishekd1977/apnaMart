import { useParams, Link } from 'react-router-dom'
import { useOrder } from '@/hooks/useOrders'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError } = useOrder(id!)

  if (isLoading) return <div className="text-center py-16 text-gray-500 animate-pulse">Loading order...</div>
  if (isError || !order) return <div className="text-center py-16 text-gray-500">Order not found</div>

  const addr = order.shippingAddress

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-gray-500">{item.author} × {item.quantity}</p>
              </div>
              <span className="font-semibold text-gray-900">₹{item.subtotal}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>₹{order.finalAmount}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
          <address className="text-sm text-gray-600 not-italic">
            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
            {addr.city}, {addr.state} — {addr.pincode}<br />
            {addr.country}
          </address>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Payment</h2>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.paymentStatus}</span></p>
          <p className="text-sm text-gray-500 mt-2">
            Placed on {new Date(order.orderedAt).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <Link to="/orders" className="text-primary-600 hover:underline text-sm">← Back to Orders</Link>
    </div>
  )
}
