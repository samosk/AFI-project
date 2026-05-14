import { Router } from 'express'
import prisma from '../prisma'

const router = Router()

// GET /api/menu-items — hämta alla tillgängliga rätter
router.get('/', async (_req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' },
    })
    res.json(items)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    res.status(500).json({ error: 'Kunde inte hämta menyn' })
  }
})

export default router