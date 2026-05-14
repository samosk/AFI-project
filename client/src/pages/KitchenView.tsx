import { useState, useEffect } from 'react'
import type { Ticket } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
import { fetchTickets, updateTicketStatus } from '../hooks/useApi'
import { useSocket } from '../hooks/useSocket'
import TicketCard from '../components/TicketCard'
import './KitchenView.css'

export default function KitchenView() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [error, setError] = useState<string | null>(null)

  // Hämta alla aktiva tickets vid sidladdning
  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch(() => setError('Kunde inte hämta beställningar'))
  }, [])

  // Lyssna på nya tickets och uppdateringar via Socket.IO
  useSocket({
    'ticket:new': (ticket: Ticket) => {
      setTickets(prev => [ticket, ...prev])
    },
    'ticket:updated': (ticket: Ticket) => {
      setTickets(prev =>
        prev.map(t => (t.id === ticket.id ? ticket : t))
      )
    },
  })

  async function handleUpdateStatus(id: number, status: string) {
    try {
      await updateTicketStatus(id, status)
    } catch {
      setError('Kunde inte uppdatera status')
    }
  }

  // Sortera: PLACED först, sedan COOKING, sedan DONE
  const sortOrder = { PLACED: 0, COOKING: 1, DONE: 2 }
  const sorted = [...tickets].sort(
    (a, b) => sortOrder[a.status] - sortOrder[b.status]
  )

  const active = sorted.filter(t => t.status !== 'DONE')
  const done = sorted.filter(t => t.status === 'DONE')

  return (
    <div className="kitchen-view">
      <header className="kitchen-header">
        <h1>Köksvy</h1>
        <span className="active-count">{active.length} aktiva</span>
      </header>

      {error && <div className="kitchen-error">{error}</div>}

      {active.length === 0 && (
        <div className="empty-state">Inga aktiva beställningar just nu</div>
      )}

      <div className="ticket-grid">
        {active.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="done-header">Klara</h2>
          <div className="ticket-grid">
            {done.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}