import { Server, Socket } from 'socket.io';

const streamUserVideo = (socket: Socket, io: Server) => {
    socket.on('streamUser', (video) => {
    io.emit('streamUser', video);
    console.log('streaming', video);
  })
}

const videoHandlers = {
  streamUserVideo
}

export default videoHandlers;