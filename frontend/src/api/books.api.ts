import apiClient from './client'
import type { Book, BookSearchParams, Category, PageResponse } from '@/types/book.types'

export const booksApi = {
  getBooks: async (params: BookSearchParams = {}): Promise<PageResponse<Book>> => {
    const res = await apiClient.get('/books', { params })
    return res.data.data
  },

  getBook: async (id: string): Promise<Book> => {
    const res = await apiClient.get(`/books/${id}`)
    return res.data.data
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories')
    return res.data.data
  },
}
