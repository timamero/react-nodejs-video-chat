import { socket } from "../context/socket"
import { setNotification } from "../app/features/notificationSlice"
import { store } from "../app/store";

export const handleDeclineInvite = (peerId: string) => {
  socket.emit('decline invite', peerId)
}

export const handleAcceptInvite = (peerId: string, peerUsername: string) => {
  const notificationData = {
    notificationContent: `Waiting for a response from ${peerUsername}`,
    notificationType: 'is-warning',
    isLoading: true,
    isActive: true,
  }
  store.dispatch(setNotification(notificationData))
  socket.emit('invite private chat', peerId)
}