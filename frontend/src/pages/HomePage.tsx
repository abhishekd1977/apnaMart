import { Link } from 'react-router-dom'
import { useBooks } from '@/hooks/useBooks'
import BookCard from '@/components/books/BookCard'

export default function HomePage() {
  const { data, isLoading } = useBooks({ size: 8, sort: 'createdAt,desc' })

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl text-white p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to apnaMart</h1>
        <p className="text-primary-100 text-lg mb-8">Discover thousands of books at great prices</p>
        <Link
          to="/books"
          className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-full hover:bg-primary-50 transition-colors"
        >
          Browse Books
        </Link>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/books" className="text-primary-600 hover:underline text-sm">View All</Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.content.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
