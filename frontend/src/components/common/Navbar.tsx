import { Link } from 'react-router-dom'
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
    <nav className="sticky top-0 z-40 glass shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center shadow-md shadow-primary-200 group-hover:shadow-primary-300 transition-shadow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
              apnaMart
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center">
            <Link
              to="/books"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              Books
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {token ? (
              <>
                {/* Cart button */}
                <button
                  onClick={toggleCart}
                  aria-label="Open cart"
                  className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 5h12M7 13l-2-8" />
                  </svg>
                  {cart && cart.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md shadow-primary-200">
                      {cart.itemCount}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold select-none">
                      {user?.firstName?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user?.firstName}</span>
                    <svg className="w-3 h-3 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                    <div className="p-1.5">
                      <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <div className="my-1.5 border-t border-gray-100" />
                      <button
                        onClick={logout}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-primary-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-px"
                >
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
