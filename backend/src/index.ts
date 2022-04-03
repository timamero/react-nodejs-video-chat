import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import createSocket from './socket';

let port = process.env.PORT;
if (port === null) {
  port = '3001';
}

/*
 * Create HTTP server
*/
const server = http.createServer(app);

/*
 * Create and connect socket.io server
*/
const io: Server = createSocket(server);
console.log('Server listening on port ', port);
io.listen(Number(port));