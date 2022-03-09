/**
 * Socket callbacks for chat invitation
 */
import { store } from "../../../app/store";
import { User } from "../../../app/features/types";
import { setNotificatioInviteDeclined } from "../appActions/notification";
import { setModalInviteRequest } from "../appActions/modal";

export const handleInviteRequested = (inviterId: string) => {
  const activeUsers = store.getState().activeUsers.users
  const inviter = activeUsers.find((user: User) => user.socketId === inviterId)

  if (inviter) {
    setModalInviteRequest(inviterId, inviter)
  } 
}

export const handleInviteDeclined = (inviteeId: string) => {
  const activeUsers = store.getState().activeUsers.users
  const peer = activeUsers.find((user: User) => user.socketId === inviteeId)
  if (peer) {
    setNotificatioInviteDeclined(peer)
  }
}