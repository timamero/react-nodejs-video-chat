import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db, ObjectId } from 'mongodb';
import { client } from '../../src/database';
import user from '../../src/pubsub/users';

describe("my awesome project", () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  let db: Db;

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

    db = await client.db();
  });

  beforeEach(async () => {
    const users = db.collection('users');

    const userObjects = [
      {
        _id: new ObjectId('some-user-01'),
        username: 'Jane01'
      },
      {
        _id: new ObjectId('some-user-02'),
        username: 'Jane02'
      },
      {
        _id: new ObjectId('some-user-03'),
        username: 'Jane03'
      },
    ]
    
    // userObjects.forEach(async (user) => {
    //   await users.insertOne(user);
    // })
  })

  afterAll(async () => {
    await client.close();
    io.close();
    clientSocket.close();
  });

  it.only("when client sends message `user entered`, the new username is added to the database", async () => {
    const newUsername = 'Nora'
    const users = db.collection('users');

    clientSocket.emit('user entered', newUsername);

    const insertedUser = await users.findOne({ username: newUsername});
    expect(insertedUser).not.toBeNull()
  });
})