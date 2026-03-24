import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { useCart } from '@/hooks/useCart'
import { useLogout } from '@/hooks/useAuth'

export default function Navbar() {
  const { user, token } = useAuthStore()
  const { toggleCart } = useUIStore()
  const { data: cart } = useCart()
  const logout = useLogout()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            apnaMart
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/books" className="text-gray-600 hover:text-primary-600 transition-colors">
              Books
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-600 hover:text-primary-600"
                  aria-label="Open cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 5h12M7 13l-2-8" />
                  </svg>
                  {cart && cart.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.itemCount}
                    </span>
                  )}
                </button>
                <div className="relative group">
                  <button className="text-gray-600 hover:text-primary-600">
                    {user?.firstName}
                  </button>
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Orders
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
