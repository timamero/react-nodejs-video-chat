import { Server, Socket } from 'socket.io';

const chatMessage = (socket: Socket, io: Server) => {
   socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  })
}

const chatHandlers = {
  chatMessage
}

export default chatHandlers;