import { Server, Socket } from 'socket.io';

interface user {
  username: string | null;
  socketID: string | null;
}
let clientCaller: user = {
    username: null,
    socketID: null
  }
  let clientCallee: user = {
    username: null,
    socketID: null
  }
  
const streamPeers = (socket: Socket, io: Server) => {
  

  socket.on('userEnterRoom', username => {
    if (clientCaller.username === null) {
      clientCaller = {username, socketID: socket.id}
      console.log('set clientCaller', clientCaller, socket.id)
      const message = `Hello ${username}, waiting for other user...`
      io.to(socket.id).emit('userWaiting', message)
    } else {
      clientCallee = {username, socketID: socket.id}
      console.log('set clientCallee', clientCallee, socket.id)
      const message = `Hello ${username}, connecting you to a video chat with ${clientCaller.username}`
      io.to(socket.id).emit('userWaiting', message)

      const readyMessage = `Connecting you to ${clientCallee.username}`
      io.to(clientCaller.socketID!).emit('roomReady', readyMessage)
    }
  })

  socket.on('videoChatOffer', ({sdp}) => {
    console.log('offer::', socket.id)
    console.log(`offer - sending getVideoChatOffer to ${clientCallee.username}`)
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID!).emit('getVideoChatOffer', sdp)
    }
  })

  socket.on('videoChatAnswer', ({sdp}) => {
    console.log('answer::', socket.id)
    console.log(`answer - sending getVideoChatanswer to ${clientCaller.username}`)
    io.to(clientCaller.socketID!).emit('getVideoChatAnswer', sdp)
  })


  socket.on('candidate', ({candidate}) => {
    console.log(`ice candidate from ${socket.id}`)
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID!).emit('getCandidate', candidate)
    } else {
      io.to(clientCaller.socketID!).emit('getCandidate', candidate)
    }    
  })
}

const streamUserVideo = (socket: Socket, io: Server) => {
    socket.on('streamUser', (video) => {
      io.emit('streamUser', video);
      console.log('streaming', video);
    })
}

const videoHandlers = {
  streamUserVideo,
  streamPeers
}

export default videoHandlers;