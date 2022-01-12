import { socket } from "../context/socket"

export const handleDeclineInvite = (peerId: string) => {
  socket.emit('decline invite', peerId)
}