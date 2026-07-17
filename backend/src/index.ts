import app from './app';
import http from 'http';
import createSocket from './socket';

const port = process.env.PORT ?? '3001';

/*
 * Create HTTP server
 */
const server = http.createServer(app);

/*
 * Create and connect socket.io server
 */
createSocket(server);
console.log('Server listening on port ', port);
server.listen(Number(port), () => {
  console.log('Server listening on port', port);
});
