import { Server, Socket } from 'socket.io';
import { createRoom, addUserBySocketId, getRoomUsersSocketId, getRoom } from '../controllers/room'
import { getUserById } from '../controllers/users';

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

    try {
      const roomId = await createRoom()
      await addUserBySocketId(roomId!, inviterId)
      await addUserBySocketId(roomId!, socket.id)
      const socketIds = await getRoomUsersSocketId(roomId!)
      const roomData = { roomId: roomId?.toString(), users: socketIds }
      
      io.in(socketIds![0]).socketsJoin(roomId!.toString())
      io.in(socketIds![1]).socketsJoin(roomId!.toString())
      io.to(roomId!.toString()).emit('enter chat room', roomData)
    } catch (error) {
      console.error(error)
    }
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

  socket.on('video request accepted', async (roomId) => {
    // need to update front-end, pass roomId
    const room = await getRoom(roomId)
    const user = await getUserById(room!.users[0])
    const userSocketId = user!.socketId
    console.log('send video ready to ', userSocketId)
    io.to(userSocketId).emit('video ready')
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