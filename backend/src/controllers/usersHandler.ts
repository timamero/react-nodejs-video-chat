import { Server, Socket } from 'socket.io';

// Will implement user authentication later, for now will save active users in users list
interface User {
  id: string;
  username: string;
}

let users: User[] = []

const userHandler = (socket: Socket, io: Server) => {
  socket.on('user entered', async (username) => {
    console.log(`${username} has entered`);

    if (!users.map(user => user.id).includes(socket.id)) {
      users.push({id: socket.id, username: username});
      
      console.log('sending users', users);
      io.emit('get user list', users);
      io.to(socket.id).emit('get socket id', socket.id);
    }
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has been removed from list`);
    users = users.filter(user => user.id !== socket.id);

    io.emit('get user list', users);
  })
}

export default userHandler;