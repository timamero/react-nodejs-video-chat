import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import videoHandlers from './controllers/videoHandler';
import userHandler from './controllers/usersHandler';
import privateChatHandler from './controllers/privateChatHandler';

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

  userHandler(socket, io);
  privateChatHandler(socket, io);
  videoHandlers.streamPeers(socket, io); // test

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

io.listen(port);