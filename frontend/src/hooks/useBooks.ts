import { useQuery } from '@tanstack/react-query'
import { booksApi } from '@/api/books.api'
import type { BookSearchParams } from '@/types/book.types'

export function useBooks(params: BookSearchParams = {}) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.getBooks(params),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => booksApi.getCategories(),
    staleTime: Infinity, // Categories rarely change
  })
}
