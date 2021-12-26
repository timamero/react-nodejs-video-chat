import { Server, Socket } from 'socket.io';

const chatMessage = (socket: Socket, io: Server) => {
   socket.on('chat message', (msg) => {
    const messageData = {
      msg,
      userId: socket.id
    }
    
    io.emit('chat message', messageData);
    console.log('message: ' + msg);
  })
}

const chatHandlers = {
  chatMessage
}

export default chatHandlers;