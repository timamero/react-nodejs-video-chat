import { Server, Socket } from 'socket.io';

const streamVideo = (socket: Socket, io: Server) => {
   socket.on('stream video', (video) => {
    io.emit('stream video', video);
    console.log('streaming video');
  })
}

const videoHandlers = {
  streamVideo
}

export default videoHandlers;