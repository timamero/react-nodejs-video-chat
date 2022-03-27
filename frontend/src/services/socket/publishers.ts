/**
 * Socket event emitters
 */
import { socket } from "../../context/socket"
import { store } from "../../app/store"

/**
 * Send socket invite for user entering room
 */
export const sendUserEntered = (username: string) => {
  socket.emit('user entered', username)
}

/**
 * Send socket event to send invitation request to peer
 */
export const sendInvite = (peerId: string) => {
  socket.emit('invite private chat', peerId)
}

/**
 * Send socket event to accept invitation to chat
 */
export const sendInviteAccepted = (peerId: string) => {
  socket.emit('invite accepted', peerId)
}

/**
 * Send socket event to decline invitation to chat
 */
export const sendDeclineInvite = (peerId: string) => {
  socket.emit('decline invite', peerId)
}

/**
 * Send socket event to start RTC peer connection process
 */
export const sendVideoInvite = () => {
  const roomId = store.getState().room.roomId
  socket.emit('video request accepted', roomId)
}