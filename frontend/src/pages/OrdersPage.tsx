import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const { data, isLoading } = useOrders()

  if (isLoading) return <div className="text-center py-16 text-gray-500 animate-pulse">Loading orders...</div>

  if (!data?.content.length) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 mb-4">No orders yet</p>
        <Link to="/books" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {data.content.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Order #{order.id.slice(0, 8).toUpperCase()}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">{new Date(order.orderedAt).toLocaleDateString('en-IN')}</span>
              <span className="font-semibold text-gray-900">₹{order.finalAmount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
