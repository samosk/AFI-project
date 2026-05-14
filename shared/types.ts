export interface MenuItem {
  id: number
  name: string
  description: string | null
  category: string
  price: number
  imageUrl: string | null
  isAvailable: boolean
}

export interface TicketItem {
  id?: number
  menuItemId: number
  quantity: number
  comment: string
  price: number
  menuItem?: MenuItem
}

export interface Ticket {
  id: number
  tableId: string
  status: 'PLACED' | 'COOKING' | 'DONE'
  createdAt: string
  updatedAt: string
  items: TicketItem[]
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  comment: string
}