import type { Ticket } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
import './TicketCard.css'

interface Props {
  ticket: Ticket
  onUpdateStatus: (id: number, status: string) => void
}

const NEXT_STATUS: Record<string, string> = {
  PLACED: 'COOKING',
  COOKING: 'DONE',
}

const STATUS_LABEL: Record<string, string> = {
  PLACED: 'Beställd',
  COOKING: 'Tillagas',
  DONE: 'Klar',
}

const BUTTON_LABEL: Record<string, string> = {
  PLACED: 'Börja tillaga',
  COOKING: 'Markera klar',
}

export default function TicketCard({ ticket, onUpdateStatus }: Props) {
  const nextStatus = NEXT_STATUS[ticket.status]
  const elapsed = Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / 60000)

  return (
    <div className={`ticket-card status-${ticket.status.toLowerCase()}`}>
      <div className="ticket-header">
        <span className="table-id">{ticket.tableId}</span>
        <span className="ticket-time">{elapsed} min sedan</span>
      </div>

      <span className={`status-badge ${ticket.status.toLowerCase()}`}>
        {STATUS_LABEL[ticket.status]}
      </span>

      <div className="ticket-items">
        {ticket.items.map((item, i) => (
          <div key={i} className="ticket-item">
            <span className="ticket-qty">{item.quantity}x</span>
            <span>{item.menuItem?.name ?? `Rätt #${item.menuItemId}`}</span>
            {item.comment && <span className="ticket-comment">"{item.comment}"</span>}
          </div>
        ))}
      </div>

      {nextStatus && (
        <button
          className="status-btn"
          onClick={() => onUpdateStatus(ticket.id, nextStatus)}
        >
          {BUTTON_LABEL[ticket.status]}
        </button>
      )}
    </div>
  )
}