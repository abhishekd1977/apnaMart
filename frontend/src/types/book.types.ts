export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string | null
  description: string | null
  price: number
  mrp: number | null
  coverImageUrl: string | null
  publisher: string | null
  publishedYear: number | null
  language: string
  pages: number | null
  stockQuantity: number
  category: Category
}

export interface BookSearchParams {
  page?: number
  size?: number
  sort?: string
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}
