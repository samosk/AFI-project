import { Router } from 'express'
import { Server } from 'socket.io'
import prisma from '../prisma'

const router = Router()

// GET /api/tickets — hämta alla tickets (med items och menuItem-detaljer)
router.get('/', async (_req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ error: 'Kunde inte hämta beställningar' })
  }
})

// POST /api/tickets — skapa en ny beställning
router.post('/', async (req, res) => {
  try {
    const { tableId, items } = req.body

    if (!tableId || !items || items.length === 0) {
      return res.status(400).json({ error: 'tableId och items krävs' })
    }

    const ticket = await prisma.ticket.create({
      data: {
        tableId,
        status: 'PLACED',
        items: {
          create: items.map((item: { menuItemId: number; quantity: number; comment: string; price: number }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            comment: item.comment || '',
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    })

    // Pusha till köksvyn via Socket.IO
    const io: Server = req.app.get('io')
    io.emit('ticket:new', ticket)

    res.status(201).json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error)
    res.status(500).json({ error: 'Kunde inte skapa beställning' })
  }
})

// PATCH /api/tickets/:id — uppdatera status
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    if (!['PLACED', 'COOKING', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Ogiltig status' })
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    })

    // Pusha uppdateringen till alla klienter
    const io: Server = req.app.get('io')
    io.emit('ticket:updated', ticket)

    res.json(ticket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ error: 'Kunde inte uppdatera status' })
  }
})

export default router