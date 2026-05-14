import type { Ticket } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
import './StatusTracker.css'

interface Props {
  ticket: Ticket
}

const STEPS = [
  { key: 'PLACED', label: 'Beställd' },
  { key: 'COOKING', label: 'Tillagas' },
  { key: 'DONE', label: 'Klar!' },
]

export default function StatusTracker({ ticket }: Props) {
  const currentIndex = STEPS.findIndex(s => s.key === ticket.status)

  return (
    <div className="status-tracker">
      <div className="status-steps">
        {STEPS.map((step, i) => (
          <div key={step.key} className={`step ${i <= currentIndex ? 'active' : ''}`}>
            <div className="step-dot" />
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="ticket-items-summary">
        {ticket.items.map((item, i) => (
          <div key={i} className="ticket-item-row">
            <span>{item.quantity}x {item.menuItem?.name ?? `Rätt #${item.menuItemId}`}</span>
            <span className="item-price">{item.price * item.quantity} kr</span>
          </div>
        ))}
      </div>
    </div>
  )
}