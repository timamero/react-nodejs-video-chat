import { Server, Socket } from 'socket.io';
import { createRoom } from '../../src/controllers/room'

let peer1: string;
let peer2: string;
console.log('privateChat loaded')
const privateChat = async (socket: Socket, io: Server) => {
  socket.on('invite private chat', (inviteeId) => {
    console.log(`${socket.id} invited ${inviteeId} to a chat`)

    // Send invite request with inviter id to invitee
    io.to(inviteeId).emit('invite requested', socket.id)
  })

  socket.on('invite accepted', async (inviterId) => {
    console.log(`${socket.id} accepted chat with ${inviterId}`)
    peer1 = inviterId
    peer2 = socket.id

    const roomId = await createRoom()
    const roomData = { roomId: roomId, users: [peer1 , peer2] }
    
    
    io.in(peer2).socketsJoin(roomId!)
    io.in(peer1).socketsJoin(roomId!)

    io.to(roomId!).emit('enter chat room', roomData)
  })

  socket.on('decline invite', (inviterId) => {
    console.log(`${socket.id} declined chat with ${inviterId}`)

    io.to(inviterId).emit('invite declined', socket.id)
  })

  socket.on('send chat message', (sentMessageData) => {
    const messageData = {
      msg: sentMessageData.msg,
      userId: socket.id
    }
    
    io.to(sentMessageData.roomId).emit('receive chat message', messageData);
    console.log('message: ' + messageData.msg);
  })

  socket.on('video request accepted', () => {
    console.log('send video ready to ', peer1)
    io.to(peer1).emit('video ready')
  })

  socket.on('video offer', ({sdp}) => {
    console.log(`send get video offer to ${peer2}`)
    
    if (socket.id === peer1) {
      io.to(peer2).emit('get video offer', sdp)
    }
  })

  socket.on('video answer', ({sdp}) => {
    console.log(`answer - send get video answer to ${peer1}`)
    io.to(peer1).emit('get video answer', sdp)
  })

  socket.on('candidate', ({candidate}) => {
    console.log(`ice candidate from ${socket.id}`)
    
    if (socket.id === peer1) {
      console.log('send get candidate to peer2')
      io.to(peer2).emit('get candidate', candidate)
    } else {
      console.log('send get candidate to peer1')
      io.to(peer1).emit('get candidate', candidate)
    }
  })

  socket.on('end chat', (roomId) => {
    console.log(`end chat for room ${roomId}`)
    io.to(peer1).emit('end video request')
    io.to(peer2).emit('end video request')
    io.to(roomId).emit('close chat room')
  })
}

export default privateChat;