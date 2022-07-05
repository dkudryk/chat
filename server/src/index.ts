import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'

import { SOCKET_EVENTS } from '../../client/src/utils/constants'

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(express.static(path.resolve(__dirname, '../../client/build')))

const chat = []

io.on(SOCKET_EVENTS.CONNECT, socket => {
  socket.emit(SOCKET_EVENTS.INIT, chat)

  socket.broadcast.emit(SOCKET_EVENTS.GET, 'A new user has joined...')

  socket.on(SOCKET_EVENTS.POST, (message, callback) => {
    chat.push(message)
    io.emit(SOCKET_EVENTS.GET, message)
    callback()
  })

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    io.emit(SOCKET_EVENTS.GET, 'A user has left...')
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
