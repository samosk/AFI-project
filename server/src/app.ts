import express from 'express'
import cors from 'cors'
import menuItemsRouter from './routes/menuItems'
import ticketsRouter from './routes/tickets'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/menu-items', menuItemsRouter)
app.use('/api/tickets', ticketsRouter)

export default app