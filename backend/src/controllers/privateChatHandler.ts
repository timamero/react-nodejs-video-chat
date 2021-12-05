import { Server, Socket } from 'socket.io';

const privateChatHandler = (socket: Socket, io: Server) => {
  socket.on('invite private chat', (inviteeId) => {
    console.log(`${socket.id} invited ${inviteeId} to a chat`)

    // Send invite request with inviter id to invitee
    io.to(inviteeId).emit('invite requested', socket.id)
  })

  socket.on('invite accepted', (inviterId) => {
    console.log(`${socket.id} accepted chat with ${inviterId}`)

    // Add invitee and inviter join a private room
    const privateRoom = `${inviterId}-room`
    io.in(socket.id).socketsJoin(privateRoom)
    io.in(inviterId).socketsJoin(privateRoom)

    // Send invite request with inviter id to invitee
    io.to(privateRoom).emit('enter chat room', privateRoom)
  })

  socket.on('decline invite', (inviterId) => {
    console.log(`${socket.id} declined chat with ${inviterId}`)

    // Send inviter event that invite was declined
    io.to(inviterId).emit('invite declined', socket.id)
  })

  // socket.on('disconnect', () => {

  // })
}

export default privateChatHandler;