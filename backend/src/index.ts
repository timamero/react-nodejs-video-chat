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
server.listen(Number(port), '0.0.0.0', () => {
  console.log('Server listening on port', port);
});
