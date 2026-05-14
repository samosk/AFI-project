import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import app from './app'
import { setupKitchenSocket } from './socket/kitchenSocket'

dotenv.config()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
})

setupKitchenSocket(io)

// Gör io tillgänglig för routes via app
app.set('io', io)

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})