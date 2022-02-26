import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db } from 'mongodb';
import { client } from '../../src/database';
import user from '../../src/pubsub/users';

describe("Pubsub - users", () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  let db: Db;

  beforeAll((done) => {
    const httpServer = createServer();
    const options = {
      path: '/',
      serveClient: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
    }
    io = new Server(httpServer, options);
    const port = 9000

    httpServer.listen(port, () => {
      clientSocket = clientIo(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
        user(serverSocket, io);
        client.connect()
        db = client.db()
      });
      clientSocket.on("connect", () => {     
        done()
      });
    });
  });

  afterAll(async () => {
    await client.close();
    io.close();
    clientSocket.close();
  });

  it("when client sends message `user entered`, the new username is added to the database", (done) => {
    const newUsername = 'Nora'
    const users = db.collection('users');

    serverSocket.on('user entered', async (arg) => {
      const insertedUser = await users.findOne({ username: newUsername});
      expect(insertedUser).not.toBeNull()
      done()
    })
    clientSocket.emit('user entered', newUsername);  
  });
})