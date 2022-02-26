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
    } catch (error) {
      console.error(error)
    }
    
    console.log('user created')
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