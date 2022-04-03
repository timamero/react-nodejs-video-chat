import { Server, Socket } from 'socket.io';
import { getAllUsers, createUser, deleteUserBySocketId } from '../controllers/users';

const user = async (socket: Socket, io: Server) => {
  socket.on('user entered', async (username) => {
    try {
      await createUser({ socketId: socket.id, username: username, isBusy: false });

      const usersList = await getAllUsers();
      io.emit('get user list', usersList);
      io.to(socket.id).emit('get socket id', socket.id);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('update user list', async () => {
    const usersList = await getAllUsers();
    io.emit('get user list', usersList);
  });

  socket.on('disconnect', async () => {
    try {
      await deleteUserBySocketId(socket.id);

      const usersList = await getAllUsers();
      io.emit('get user list', usersList);
    } catch (error) {
      console.error(error);
    }
  });
};

export default user;