import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';
import { Db } from 'mongodb';
import { client } from '../../src/database';
import { createUser } from '../../src/controllers/users';
import user from '../../src/pubsub/users';
import privateChat from '../../src/pubsub/privateChat';

/**
 * Test privateChat socket event publishers and subscribers
 */
describe('Pubsub - privateChat', () => {
  let io: Server, serverSocket: Socket;
  let clientSocket1: ClientSocket, clientSocket2: ClientSocket;
  let  client1Id: string, client2Id: string;

  let db: Db;

  const port = 9000;

  beforeAll((done) => {
    /* Connect to MongoDB test database*/
    client.connect(() => {
      const globalDBName = global as typeof globalThis & {
        __MONGO_DB_NAME__: string;
      };
      db = client.db(globalDBName.__MONGO_DB_NAME__);

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
      };
      /* Create server listener */
      httpServer.listen(port);
      console.log('create server listener');

      /* Create client sockets and connect */
      clientSocket1 = clientIo(`http://localhost:${port}`);
      clientSocket2 = clientIo(`http://localhost:${port}`);
      clientSocket1.connect();
      clientSocket2.connect();

      /* Create server socket */
      io = new Server(httpServer, options);

      /* Create server and socket listener events */
      let connectionNumber = 0;
      io.on('connection', async (socket) => {
        if (connectionNumber === 0) {
          client1Id = socket.id;
          console.log('client1Id', client1Id);
          serverSocket = socket;
          /* Initialize users socket event publishers and subscribers */
          user(serverSocket, io);

          connectionNumber++;
        } else {
          client2Id = socket.id;
          console.log('client2Id', client2Id);
          serverSocket = socket;
          /* Initialize users socket event publishers and subscribers */
          user(serverSocket, io);
          privateChat(serverSocket, io);
          done();
        }
      });
    });
  });

  beforeEach(async () => {
    /* Clear database before each test */
    await db.collection('room').deleteMany({});
    await db.collection('users').deleteMany({});

    /* Add users to database before each test */
    await createUser({ socketId: client1Id, username: 'Nora' });
    await createUser({ socketId: client2Id, username: 'Jane' });
  });

  afterAll(async () => {
    console.log('closing sockets and database');
    /* Disconnect client sockets */
    clientSocket1.disconnect();
    clientSocket2.disconnect();

    /* Close socket connections */
    io.close();
    clientSocket1.close();
    clientSocket2.close();

    /* Close MongoDB database connection */
    await client.close();

    /*
      Error when closing connection to database and sockets.
      After connection to MongoDB is closed, asynchronous methods
      using the database are called, resulting in a MongoDB
      connection error.
    */
  });

  it.only('when server receives \'invite private chat\' event, the server emits the \'invite requested\' event to the invitee client', (done) => {
    // Test is currently failing.
    // Error: thrown: "Exceeded timeout of 5000 ms for a test.
    clientSocket1.emit('invite private chat', client2Id);

    clientSocket2.on('invite requested', (arg) => {
      console.log('invite requested');
      expect(arg).toBeDefined();
      expect(arg).toEqual(client1Id);
      done();
    });
  });
});