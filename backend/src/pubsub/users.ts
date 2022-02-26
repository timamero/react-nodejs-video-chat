import { Server, Socket } from 'socket.io';
// import { ObjectId } from 'mongodb';
// import { client } from '../database';
import { getAllUsers, createUser } from '../controllers/users';

interface User {
  id: string;
  username: string;
}

let users: User[] = []

const user = (socket: Socket, io: Server) => {
  socket.on('user entered', async (username) => {
    try {
      await createUser({_id: socket.id, username: username});

      let usersList = await getAllUsers()
      io.emit('get user list', usersList);
      io.to(socket.id).emit('get socket id', socket.id);
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has been removed from list`);
    users = users.filter(user => user.id !== socket.id);

    io.emit('get user list', users);
  })
}

export default user;