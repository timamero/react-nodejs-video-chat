import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db, ObjectId } from 'mongodb';
import { client } from '../../src/database';
import user from '../../src/pubsub/users';

describe("my awesome project", () => {
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
      });
      // clientSocket.connect()
      // clientSocket.on("connect", done);
      clientSocket.on("connect", () => {
        // client.connect()
        done()
      });

    });

    // db = await client.db();
  });

  beforeEach(async () => {
    // user(serverSocket, io);
    // const users = db.collection('users');

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

  afterAll(() => {
    // await client.close();
    io.close();
    clientSocket.close();
  });

  it("when client sends message `user entered`, the new username is added to the database", (done) => {
    const newUsername = 'Nora'
    // const users = db.collection('users');

    serverSocket.on('user entered', (arg) => {
      console.log('yes')
      done()
    })
    clientSocket.emit('user entered', newUsername);

    // const insertedUser = await users.findOne({ username: newUsername});
    // expect(insertedUser).not.toBeNull()
  });
})