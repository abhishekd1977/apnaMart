import { Link } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart'

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { data: cart, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Cart {cart?.itemCount ? `(${cart.itemCount})` : ''}
          </h2>
          <button onClick={closeCart} className="p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading && (
            <p className="text-center text-gray-400 animate-pulse mt-8">Loading...</p>
          )}

          {!isLoading && (!cart || cart.items.length === 0) && (
            <div className="text-center mt-16">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-primary-600 hover:underline text-sm"
              >
                Continue shopping
              </button>
            </div>
          )}

          {cart && cart.items.length > 0 && (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="w-14 h-18 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.coverImageUrl ? (
                      <img src={item.coverImageUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.bookTitle}</p>
                    <p className="text-xs text-gray-500 truncate">{item.bookAuthor}</p>
                    <p className="text-sm font-semibold mt-1">₹{item.unitPrice}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-300 rounded text-sm">
                        <button
                          onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                          className="px-2 py-0.5 hover:bg-gray-50"
                        >−</button>
                        <span className="px-2 py-0.5 border-x border-gray-300">{item.quantity}</span>
                        <button
                          onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          className="px-2 py-0.5 hover:bg-gray-50"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem.mutate(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold shrink-0">₹{item.subtotal}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">₹{cart.total}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center font-medium py-3 rounded-md transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="block w-full text-center text-sm text-primary-600 hover:underline"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
