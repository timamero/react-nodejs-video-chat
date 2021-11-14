import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import chatHandlers from './controllers/chatHandler';
import videoHandlers from './controllers/videoHandler';

const port = 3001;
const server = http.createServer(app);

const options = {
  path: '/',
  serveClient: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
}

const io: Server = new Server(server, options);

io.on('connection', (socket) => {
  console.log('a user connected');

  chatHandlers.chatMessage(socket, io);
  videoHandlers.streamUserVideo(socket, io);
  videoHandlers.streamPeers(socket, io);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

io.listen(port);