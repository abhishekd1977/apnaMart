import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBook } from '@/hooks/useBooks'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/auth.store'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading, isError } = useBook(id!)
  const addToCart = useAddToCart()
  const isAuthenticated = useAuthStore((s) => !!s.token)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  if (isLoading) return <div className="text-center py-16 text-gray-500 animate-pulse">Loading...</div>
  if (isError || !book) return <div className="text-center py-16 text-gray-500">Book not found</div>

  const discount = book.mrp && book.mrp > book.price
    ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
    : null

  function handleAddToCart() {
    if (!isAuthenticated) { navigate('/login'); return }
    addToCart.mutate({ bookId: book!.id, quantity })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          <div className="w-full md:w-64 shrink-0">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                {book.category.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{book.title}</h1>
              <p className="text-lg text-gray-500 mt-1">by {book.author}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{book.price}</span>
              {book.mrp && book.mrp > book.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{book.mrp}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{book.description}</p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {book.publisher && <><dt className="text-gray-500">Publisher</dt><dd className="text-gray-900">{book.publisher}</dd></>}
              {book.publishedYear && <><dt className="text-gray-500">Year</dt><dd className="text-gray-900">{book.publishedYear}</dd></>}
              {book.pages && <><dt className="text-gray-500">Pages</dt><dd className="text-gray-900">{book.pages}</dd></>}
              <dt className="text-gray-500">Language</dt><dd className="text-gray-900">{book.language}</dd>
              {book.isbn && <><dt className="text-gray-500">ISBN</dt><dd className="text-gray-900">{book.isbn}</dd></>}
            </dl>

            {book.stockQuantity > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">−</button>
                  <span className="px-4 py-2 border-x border-gray-300 text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(book.stockQuantity, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 rounded-md font-medium transition-colors disabled:bg-gray-300"
                >
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <p className="text-red-500 font-medium">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
