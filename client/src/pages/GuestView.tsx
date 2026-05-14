import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { MenuItem, CartItem, Ticket } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
import { fetchMenuItems, createTicket } from '../hooks/useApi'
import { useSocket } from '../hooks/useSocket'
import MenuList from '../components/MenuList'
import Cart from '../components/Cart'
import StatusTracker from '../components/StatusTracker'
import './GuestView.css'

export default function GuestView() {
  const { tableId } = useParams<{ tableId: string }>()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hämta menyn vid sidladdning
  useEffect(() => {
    fetchMenuItems()
      .then(setMenuItems)
      .catch(() => setError('Kunde inte ladda menyn'))
  }, [])

  // Lyssna på statusuppdateringar via Socket.IO
  useSocket({
    'ticket:updated': (ticket: Ticket) => {
      if (ticket.tableId === tableId) {
        setActiveTicket(ticket)
      }
    },
  })

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      }
      return [...prev, { menuItem: item, quantity: 1, comment: '' }]
    })
  }

  function updateQuantity(menuItemId: number, delta: number) {
    setCart(prev =>
      prev
        .map(c =>
          c.menuItem.id === menuItemId
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter(c => c.quantity > 0)
    )
  }

  function updateComment(menuItemId: number, comment: string) {
    setCart(prev =>
      prev.map(c =>
        c.menuItem.id === menuItemId ? { ...c, comment } : c
      )
    )
  }

  async function handleSubmit() {
    if (!tableId || cart.length === 0) return
    setIsSubmitting(true)
    setError(null)

    try {
      const items = cart.map(c => ({
        menuItemId: c.menuItem.id,
        quantity: c.quantity,
        comment: c.comment,
        price: c.menuItem.price,
      }))
      const ticket = await createTicket(tableId, items)
      setActiveTicket(ticket)
      setCart([])
    } catch {
      setError('Något gick fel, försök igen')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Om en beställning är aktiv, visa statusvyn
  if (activeTicket && activeTicket.status !== 'DONE') {
    return (
      <div className="guest-view">
        <header className="guest-header">
          <h1>{tableId}</h1>
          <p>Din beställning är skickad</p>
        </header>
        <StatusTracker ticket={activeTicket} />
      </div>
    )
  }

  return (
    <div className="guest-view">
      <header className="guest-header">
        <h1>{tableId}</h1>
        <p>Välj rätter från menyn</p>
      </header>

      {error && <div className="error-msg">{error}</div>}

      {activeTicket?.status === 'DONE' && (
        <div className="done-msg">Din förra beställning är klar! Beställ gärna mer.</div>
      )}

      <div className="guest-content">
        <MenuList items={menuItems} onAdd={addToCart} />
      </div>

      <Cart
        items={cart}
        onUpdateQuantity={updateQuantity}
        onUpdateComment={updateComment}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}