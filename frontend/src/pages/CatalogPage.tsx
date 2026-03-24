import { useState } from 'react'
import { useBooks, useCategories } from '@/hooks/useBooks'
import BookCard from '@/components/books/BookCard'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useBooks({ search: search || undefined, categoryId, page, size: 20 })
  const { data: categories } = useCategories()

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="hidden md:block w-56 shrink-0">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => { setCategoryId(undefined); setPage(0) }}
                className={`w-full text-left px-2 py-1.5 rounded text-sm ${!categoryId ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Books
              </button>
            </li>
            {categories?.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => { setCategoryId(cat.id); setPage(0) }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm ${categoryId === cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search by title or author..."
            className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : data?.content.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No books found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data?.content.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={data.first}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600 text-sm">
                  Page {data.number + 1} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
