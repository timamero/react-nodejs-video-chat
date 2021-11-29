import { Server, Socket } from 'socket.io';

const privateChatHandler = (socket: Socket, io: Server) => {
  socket.on('invite private chat', (inviteeId) => {
    console.log(`${socket.id} invited ${inviteeId} to a chat`)
  })

  // socket.on('disconnect', () => {

  // })
}

export default privateChatHandler;