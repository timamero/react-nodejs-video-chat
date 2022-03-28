import { Server, Socket } from 'socket.io';
import { getAllUsers, createUser, deleteUserBySocketId } from '../controllers/users';

const user = async (socket: Socket, io: Server) => {
  socket.on('user entered', async (username) => {
    try {
      await createUser({socketId: socket.id, username: username, isBusy: false});

      let usersList = await getAllUsers()
      io.emit('get user list', usersList);
      io.to(socket.id).emit('get socket id', socket.id);
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('disconnect', async () => {
    try {
      await deleteUserBySocketId(socket.id)

      let usersList = await getAllUsers()
      io.emit('get user list', usersList);
    } catch (error) {
      console.error(error)
    }
  })
}

export default user;