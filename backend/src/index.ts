import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import createSocket from './socket';

const port = 3001;

/*
 * Create HTTP server
*/
const server = http.createServer(app);

/*
 * Create and connect socket.io server
*/
const io: Server = createSocket(server);
io.listen(port);