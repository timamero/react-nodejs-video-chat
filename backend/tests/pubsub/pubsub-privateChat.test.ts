import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db } from 'mongodb';
import { client } from '../../src/database';
import { createUser } from '../../src/controllers/users'
import user from '../../src/pubsub/users';

/**
 * Test privateChat socket event publishers and subscribers
 */
describe("Pubsub - privateChat", () => {
  let io: Server, serverSocket: Socket;
  let clientSocket1: ClientSocket, clientSocket2: ClientSocket;
  let  client1Id: String, client2Id: String;

  let db: Db;

  const port = 9000

  beforeAll((done) => {
    /* Connect to MongoDB test database*/
    client.connect(err => {
      let globalDBName = global as typeof globalThis & {
        __MONGO_DB_NAME__: string;
      }
      db = client.db(globalDBName.__MONGO_DB_NAME__)

      // Connect to sockets after MongoDB connection is established

      /* Create HTTP server */
      const httpServer = createServer();
      const options = {
        path: '/',
        serveClient: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        },
      }
      /* Create server listener */
      httpServer.listen(port);
      console.log('create server listener')

      /* Create client sockets and connect */
      clientSocket1 = clientIo(`http://localhost:${port}`);
      clientSocket2 = clientIo(`http://localhost:${port}`);
      clientSocket1.connect()
      clientSocket2.connect()

      /* Create server socket */
      io = new Server(httpServer, options);

      /* Create server and socket listener events */
      let connectionNumber = 0
      io.on("connection", async (socket) => {
        if (connectionNumber === 0) {
          client1Id = socket.id
          serverSocket = socket;
          /* Initialize users socket event publishers and subscribers */
          user(serverSocket, io);

          connectionNumber++
        } else {
          client2Id = socket.id
          serverSocket = socket;
          /* Initialize users socket event publishers and subscribers */
          user(serverSocket, io);
          done()
        }
      });
    })
  });

  beforeEach(async () => {
    /* Clear database before each test */
    await db.collection('room').deleteMany({})
    await db.collection('users').deleteMany({})

    /* Add users to database before each test */
    await createUser({socketId: client1Id, username: 'Nora'})
    await createUser({socketId: client2Id, username: 'Jane'})
  });

  afterAll(async () => {
    /* Disconnect client sockets */
    clientSocket1.disconnect();
    clientSocket2.disconnect();

    /* Close socket connections */
    io.close();
    clientSocket1.close();
    clientSocket2.close();

    /* Close MongoDB database connection */
    await client.close()
  });

  it.only("when server receives 'invite private chat' event, the server emits the 'invite requested' event to the invitee client", async () => {
    const users = db.collection('users');
    const usersList = await users.find({}).toArray()
    console.log('userslist', usersList) 
  });
})