import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db } from 'mongodb';
import { client } from '../../src/database';
import user from '../../src/pubsub/users';

/**
 * Test privateChat socket event publishers and subscribers
 */
describe("Pubsub - privateChat", () => {
  let io: Server, serverSocket: Socket;
  let clientSocket1: ClientSocket, clientSocket2: ClientSocket;

  let db: Db;

  const port = 9000

  beforeAll((done) => {
    /* Connect to MongoDB test database*/
    client.connect()
    db = client.db()

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

    /* Create server socket */
    io = new Server(httpServer, options);

    /* Create server and socket listener events */
    io.on("connection", (socket) => {
      serverSocket = socket;
      
      /* Initialize users socket event publishers and subscribers */
      user(serverSocket, io);
    });

    /* Create server listener */
    httpServer.listen(port);
    done()
  });

  beforeEach((done) => {
    /* Clear database before each test */
    db.collection('room').deleteMany({})
      .then(() => {
        /* Create client sockets before each test */
        clientSocket1 = clientIo(`http://localhost:${port}`);
        clientSocket2 = clientIo(`http://localhost:${port}`);

        clientSocket1.on("connect", () => {     
          clientSocket2.on("connect", () => {     
            done()
          });
        });

        
      })

  });

  afterEach((done) => {
    /* Disconnect client sockets after each test */
    if (clientSocket1.connected ) {
      clientSocket1.disconnect()
    }

    if (clientSocket2.connected ) {
      clientSocket2.disconnect()
    }

    done()
  })

  afterAll(async () => {
    /* Close connection to MongoDB test database */
    await client.close();

    /* Close connections to server and client sockets */
    io.close();
    clientSocket1.close();
    clientSocket2.close();
  });

  it("when server receives 'invite private chat' event, the server emits the 'invite requested' event to the invitee client", (done) => {

  });
})