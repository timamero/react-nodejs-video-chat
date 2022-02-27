import { Server, Socket } from 'socket.io';
import { io as clientIo, Socket as ClientSocket} from 'socket.io-client';
import { createServer } from 'http';
import { Db } from 'mongodb';
import { client } from '../../src/database';
import user from '../../src/pubsub/users';

/**
 * Test users socket event publishers and subscribers
 */
describe("Pubsub - users", () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  let db: Db;

  const port = 9000

  beforeAll((done) => {
    /* Connect to MongoDB test database */
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
    db.collection('users').deleteMany({})
      .then(() => {
        /* Create client socket before each test */
        clientSocket = clientIo(`http://localhost:${port}`);

        clientSocket.on("connect", () => {     
          done()
        });
      })

  });

  afterEach((done) => {
    /* Disconnect client socket after each test */
    if (clientSocket.connected ) {
      clientSocket.disconnect()
    }
    done()
  })

  afterAll(async () => {
    /* Close connection to MongoDB test database */
    await client.close();

    /* Close connections to server and client sockets */
    io.close();
    clientSocket.close();
  });

  it("when server receives `user entered` event, the new username is added to the database", (done) => {
    const newUsername = 'Nora'
    const users = db.collection('users');

    clientSocket.emit('user entered', newUsername);  

    serverSocket.on('user entered', async (arg) => {
      const insertedUser = await users.findOne({ username: newUsername});
      expect(insertedUser).not.toBeNull()
      expect(insertedUser?.username).toEqual(newUsername)
      done()
    })
  });

  it("after server recieves `user entered` event, server sends `get user list` event and users list to all clients", (done) => {
    const newUsername = 'Nora'
    const users = db.collection('users');

    clientSocket.emit('user entered', newUsername);    

    clientSocket.on('get user list', (arg) => {
      expect(arg).not.toBeNull()
      expect(arg).toHaveLength(1)

      users.findOne({ username: newUsername})
        .then(user => {
          expect(arg[0].socketId).toEqual(user?.socketId)
          expect(arg[0].username).toEqual(user?.username)
          done()
        })
    })  
  });

  it("after server receives `user entered` event, server sends `get socket id` event and socketId to client that just connected", (done) => {
    const newUsername = 'Nora'
    const users = db.collection('users');
    
    clientSocket.emit('user entered', newUsername);  

    clientSocket.on('get socket id', (arg) => {
      expect(arg).not.toBeNull()

      users.findOne({ username: newUsername})
        .then(user => {
          expect(user?.socketId).toEqual(arg)
          done()
        })
    })
  });

  it("after client disconnects, the client data is removed from the database", (done) => {
    /* After client sends `user entered` event, check that user data is in database */
    const newUsername = 'Nora'
    const users = db.collection('users');
    
    clientSocket.emit('user entered', newUsername);  

    serverSocket.on('user entered', async (arg) => {
      const insertedUser = await users.findOne({ username: newUsername});
      expect(insertedUser).not.toBeNull()
      expect(insertedUser?.username).toEqual(newUsername)
      
      /* Disconnect client */
      clientSocket.disconnect()
    })

    /* Check that the data of the disconnected user is not in database */
    serverSocket.on('disconnect', async () => {
      const insertedUser = await users.findOne({ username: newUsername});
      const usersList = await users.find({}).toArray()

      expect(insertedUser).toBeNull()
      expect(usersList).toHaveLength(0)
      done()
    })
  })

  it("after client disconnects and client data is removed from database, server sends `get user list` event and updated users list to all clients", (done) => {
    /* Connect a second client */
    const clientSocket2 = clientIo(`http://localhost:${port}`);

    const newUsername = 'Nora'
    const newUsername2 = 'Fennec'
    const users = db.collection('users');
    
    /* First client sends `user entered` event */
    clientSocket.emit('user entered', newUsername);  

    serverSocket.on('user entered', async (arg) => {
      const insertedUser = await users.findOne({ username: newUsername});
      expect(insertedUser).not.toBeNull()
      expect(insertedUser?.username).toEqual(newUsername)

      /* Second client sends `user entered` event */
      clientSocket.emit('user entered', newUsername2)
      
      /* Disconnect first client */
      if (arg === newUsername2) {
        clientSocket.disconnect()
      }
    })

    /* Check that the updated list is sent to remaining connected client */
    serverSocket.on('disconnect', async () => {
      const insertedUser = await users.findOne({ username: newUsername});
      const usersList = await users.find({}).toArray()

      expect(insertedUser).toBeNull()
      expect(usersList).toHaveLength(1)
    })

    /* Check that the second client received the updated list which should not contain the first client */
    let numberOfTimesListReceived = 0
    clientSocket2.on('get user list', (arg) => {
      /* 
        clientSocket2 will recieve `get user list` event two times
        compare the results after the second time
      */
      if (numberOfTimesListReceived === 0) {
        numberOfTimesListReceived++
      } else {
        expect(arg).not.toBeNull()
        expect(arg).toHaveLength(1)
        expect(arg[0].username).toEqual(newUsername2)

        clientSocket2.disconnect()
        clientSocket2.close()
        done()
      }   
    })
  })
})