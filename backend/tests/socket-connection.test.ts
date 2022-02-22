import { io } from "socket.io-client";
import { createServer } from "http";
import { Server } from 'socket.io';

describe('Socket Connection', () => {
  // const port = 3000
  // let httpServer
  let ioServer: Server
  let serverSocket
  let clientSocket

  beforeAll(() => {
    console.log('socket connection test')
    const httpServer = createServer()

    ioServer = new Server(httpServer)
    httpServer.listen(() => {
      const port = httpServer.address()

      clientSocket = io(`http://localhost:${port}`)

      clientSocket.on('connection', () => console.log('client - connected'))
    })
  })

  afterAll(() => {
    ioServer.close()
  })

  it.only('Server should receive a message when the client connects', () => {
    ioServer.on("connection", () => console.log('server - connected'))
  })
  
})