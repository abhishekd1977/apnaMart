import { Link } from 'react-router-dom'
import type { Book } from '@/types/book.types'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

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
    <Link to={`/books/${book.id}`} className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs">{book.author}</p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{book.price}</span>
            {book.mrp && book.mrp > book.price && (
              <span className="text-gray-400 text-xs line-through ml-1">₹{book.mrp}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={book.stockQuantity === 0 || addToCart.isPending}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white text-xs px-3 py-1.5 rounded transition-colors"
          >
            {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
