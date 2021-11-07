import express from 'express';
import cors from 'cors'
import http from 'http';
import { Server } from 'socket.io'

const app = express();
app.use(cors())

const port = 3001
const server = http.createServer(app)

const options = {
  path: '/',
  serveClient: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
}

const io: Server = new Server(server, options);
// io.path('/')



io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
    console.log('message: ' + msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

io.listen(port);

