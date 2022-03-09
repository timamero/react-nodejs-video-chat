/**
 * Socket callbacks for chat invitation and setting up private chat room
 */
import { store } from "../../../app/store";
import { User } from "../../../app/features/types";
import { setNotificatioInviteDeclined } from "../appActions/notification";

export const handleInviteDeclined = (inviteeId: string) => {
  const activeUsers = store.getState().activeUsers.users
  const peer = activeUsers.find((user: User) => user.socketId === inviteeId)
  if (peer) {
    setNotificatioInviteDeclined(peer)
  }
}