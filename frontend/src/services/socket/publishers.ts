/**
 * Socket event emitters
 */
import { socket } from "../../context/socket"

/**
 * Send socket event to send invitation request to peer
 */
export const handleSendInvite = (peerId: string) => {
  socket.emit('invite private chat', peerId)
}

/**
 * Send socket event to accept invitation to chat
 */
export const handleInviteAccepted = (peerId: string) => {
  socket.emit('invite accepted', peerId)
}

/**
 * Send socket event to decline invitation to chat
 */
export const handleDeclineInvite = (peerId: string) => {
  socket.emit('decline invite', peerId)
}

/**
 * Send socket event to start RTC peer connection process
 */
export const handleSendVideoInvite = () => {
  socket.emit('video request accepted')
}