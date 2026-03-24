import { Link } from 'react-router-dom'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  if (isLoading) return <div className="text-center py-16 text-gray-500 animate-pulse">Loading cart...</div>

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/books" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md">
          Browse Books
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart ({cart.itemCount} items)</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-4 flex gap-4">
              <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                {item.coverImageUrl && (
                  <img src={item.coverImageUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.bookTitle}</h3>
                <p className="text-sm text-gray-500">{item.bookAuthor}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">₹{item.unitPrice}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-gray-300 rounded text-sm">
                  <button
                    onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                    className="px-2 py-1 hover:bg-gray-50"
                  >−</button>
                  <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                  <button
                    onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    className="px-2 py-1 hover:bg-gray-50"
                  >+</button>
                </div>
                <p className="font-semibold">₹{item.subtotal}</p>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:w-72">
          <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>₹{cart.total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{cart.total}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center font-medium py-3 rounded-md transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
