import { Link, useNavigate } from 'react-router-dom'
import type { Book } from '@/types/book.types'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/auth.store'

interface Props {
  book: Book
}

export default function BookCard({ book }: Props) {
  const addToCart = useAddToCart()
  const isAuthenticated = useAuthStore((s) => !!s.token)
  const navigate = useNavigate()

  const discount = book.mrp && book.mrp > book.price
    ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart.mutate({ bookId: book.id, quantity: 1 })
  }

  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-transparent hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <svg className="w-14 h-14 text-primary-300" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Slide-up CTA on hover (desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={book.stockQuantity === 0 || addToCart.isPending}
            className="w-full bg-white hover:bg-primary-50 disabled:bg-gray-200 text-gray-900 disabled:text-gray-400 text-xs font-bold py-2.5 rounded-xl transition-colors shadow-lg"
          >
            {book.stockQuantity === 0
              ? 'Out of Stock'
              : addToCart.isPending
              ? 'Adding…'
              : '+ Add to Cart'}
          </button>
        </div>

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {book.title}
        </h3>
        <p className="text-gray-400 text-xs font-medium truncate">{book.author}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-gray-900">₹{book.price}</span>
            {book.mrp && book.mrp > book.price && (
              <span className="text-gray-300 text-xs line-through">₹{book.mrp}</span>
            )}
          </div>
          {/* Fallback visible button on mobile (hover doesn't work on touch) */}
          <button
            onClick={handleAddToCart}
            disabled={book.stockQuantity === 0 || addToCart.isPending}
            className="md:hidden bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-bold"
          >
            {book.stockQuantity === 0 ? '–' : '+'}
          </button>
        </div>
      </div>
    </Link>
  )
}
