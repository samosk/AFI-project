import type { CartItem } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
//import './Cart.css'

interface Props {
  items: CartItem[]
  onUpdateQuantity: (menuItemId: number, delta: number) => void
  onUpdateComment: (menuItemId: number, comment: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function Cart({ items, onUpdateQuantity, onUpdateComment, onSubmit, isSubmitting }: Props) {
  const total = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)

  if (items.length === 0) return null

  return (
    <div className="cart">
      <h2 className="cart-title">Din beställning</h2>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.menuItem.id} className="cart-item">
            <div className="cart-item-top">
              <span className="cart-item-name">{item.menuItem.name}</span>
              <div className="quantity-controls">
                <button onClick={() => onUpdateQuantity(item.menuItem.id, -1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.menuItem.id, 1)}>+</button>
              </div>
              <span className="cart-item-price">{item.menuItem.price * item.quantity} kr</span>
            </div>
            <input
              className="comment-input"
              type="text"
              placeholder="Kommentar (t.ex. utan lök)"
              value={item.comment}
              onChange={(e) => onUpdateComment(item.menuItem.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Totalt</span>
          <span className="total-price">{total} kr</span>
        </div>
        <button
          className="submit-btn"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Skickar...' : 'Skicka beställning'}
        </button>
      </div>
    </div>
  )
}