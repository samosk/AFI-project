const API_URL = 'http://localhost:3001/api'

export async function fetchMenuItems() {
  const res = await fetch(`${API_URL}/menu-items`)
  if (!res.ok) throw new Error('Kunde inte hämta menyn')
  return res.json()
}

export async function createTicket(tableId: string, items: { menuItemId: number; quantity: number; comment: string; price: number }[]) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableId, items }),
  })
  if (!res.ok) throw new Error('Kunde inte skicka beställningen')
  return res.json()
}

export async function fetchTickets() {
  const res = await fetch(`${API_URL}/tickets`)
  if (!res.ok) throw new Error('Kunde inte hämta tickets')
  return res.json()
}

export async function updateTicketStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Kunde inte uppdatera status')
  return res.json()
}