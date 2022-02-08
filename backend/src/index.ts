import app from './app';
import http from 'http';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';
import video from './pubsub/video';
import user from './pubsub/users';
import privateChat from './pubsub/privateChat';
import { listDatabases } from './demo';
import { createUser, deleteUser, getAllUsers, getUserByUsername } from './controllers/users';

const port = 3001;


/*
 * Access variables in the .env file via process.env
*/
dotenv.config();


/*
 * Connect to MongoDB database
*/
const uri = process.env.MONGODB_URI
export const client = new MongoClient(uri)
const main = async () => {
  try {
    await client.connect()
    console.log('connected to MongoDB')

    // await createUser(client, {
    //   username: 'fennec'
    // })

    // await getUserByUsername(client, 'grogu')

    // await getUserByUsername(client, 'din')

    // await getUserByUsername(client, 'fennec')

    // await deleteUser(client, 'fennec')

    await getAllUsers(client)

  } catch(e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

main().catch(console.error)


/*
 * Create HTTP server
*/
const server = http.createServer(app);


/*
 * Create socket.io server
*/
const options = {
  path: '/',
  serveClient: false,
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
}

const io: Server = new Server(server, options);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  user(socket, io);
  privateChat(socket, io);
  video.streamPeers(socket, io); // test

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

io.listen(port);