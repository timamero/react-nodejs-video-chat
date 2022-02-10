import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import video from './pubsub/video';
import user from './pubsub/users';
import privateChat from './pubsub/privateChat';

const port = 3001;


/*
 * Create HTTP server
*/
const server = http.createServer(app);


/*
 * Create socket.io server
*/
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
  
  user(socket, io);
  privateChat(socket, io);
  video.streamPeers(socket, io); // test

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

io.listen(port);