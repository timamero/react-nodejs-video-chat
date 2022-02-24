import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { MongoClient, Db, ObjectId } from 'mongodb';
import user from '../../src/pubsub/users';

describe("my awesome project", () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  let connection: MongoClient, db: Db;

  beforeAll( async() => {
    const httpServer = createServer();
    io = new Server(httpServer);
    const port = 9000
    httpServer.listen(port, () => {
      clientSocket = clientIo(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
        user(socket, io);
      });
      clientSocket.on("connect", () => null);
    });

    let globalURI = global as typeof globalThis & {
      __MONGO_URI__: string;
    }
    connection = await MongoClient.connect(globalURI.__MONGO_URI__);
    db = await connection.db();
  });

  afterAll(async () => {
    io.close();
    clientSocket.close();

    await connection.close();
  });

  it.only("when client sends message `user entered`, server sends list of users", (done) => {
    console.log('setting up first test')
  });
})