import { Server, Socket } from 'socket.io';
// import { client } from '../database';
import { getAllUsers, createUser } from '../controllers/users';

interface User {
  id: string;
  username: string;
}

let users: User[] = []

const user = (socket: Socket, io: Server) => {
  socket.on('user entered', async (username) => {
    console.log(`${username} has entered`);

    await createUser({socketId: socket.id, username: username});

    // if (!users.map(user => user.id).includes(socket.id)) {
    //   users.push({id: socket.id, username: username});
      
    //   console.log('sending users', users);
    //   io.emit('get user list', users);
    //   io.to(socket.id).emit('get socket id', socket.id);
    // }
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has been removed from list`);
    users = users.filter(user => user.id !== socket.id);

    io.emit('get user list', users);
  })
}

export default user;