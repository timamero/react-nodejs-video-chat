import { Server, Socket } from 'socket.io';
import { getAllUsers, createUser, deleteUser } from '../controllers/users';

interface User {
  id: string;
  username: string;
}

let users: User[] = []

const user = async (socket: Socket, io: Server) => {
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

  socket.on('disconnect', async () => {
    console.log(`${socket.id} has been removed from list`);
    // users = users.filter(user => user.id !== socket.id);
    // create deleteUserById

    io.emit('get user list', users);
  })
}

export default user;