import { socket } from "../../context/socket"
import { setNotification } from "../../app/features/notificationSlice"
import { setModal } from "../../app/features/modalSlice";
import { store } from "../../app/store";

export const handleInviteToChatClick = (peerId: string, peerUsername: string) => {
  const modalData = {
    modalName: 'send chat invite',
    modalContent: `Would you like to invite ${peerUsername} to private chat?`,
    confirmBtnText: 'Yes, send invite.',
    declineBtnText: 'No, cancel invite.',
    isActive: true,
    peerId,
    socketEvent: 'invite private chat'
  }

  store.dispatch(setModal(modalData))
}

/**
 * Send socket event to send invitation request to peer
 */
export const handleSendInvite = (peerId: string, peerUsername: string) => {
  const notificationData = {
    notificationContent: `Waiting for a response from ${peerUsername}`,
    notificationType: 'is-warning',
    isLoading: true,
    isActive: true,
  }
  store.dispatch(setNotification(notificationData))
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