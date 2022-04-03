import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';

/**
 * Test connection between server and client socket
 */
describe('Socket Connection', () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    const port = 9000;
    httpServer.listen(port, () => {
      clientSocket = clientIo(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it('client should receive message from server', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  it('server should receive message from client', (done) => {
    serverSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    clientSocket.emit('hello', 'world');
  });
});