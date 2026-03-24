export interface CartItem {
  id: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  coverImageUrl: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
  itemCount: number
}
