import { Server } from 'socket.io'

export function setupKitchenSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Klienten kan joina ett rum baserat på bords-ID
    // för att bara få uppdateringar om sitt eget bord
    socket.on('join:table', (tableId: string) => {
      socket.join(`table:${tableId}`)
      console.log(`${socket.id} joined table:${tableId}`)
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })
}