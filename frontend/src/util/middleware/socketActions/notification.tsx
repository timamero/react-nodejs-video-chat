/**
 * Socket callbacks for setting notification
 */
import { setNotification, resetNotification } from "../../../app/features/notificationSlice";
import { User } from "../../../app/features/types";
import { store } from "../../../app/store";

export const setNotificationSendInvite = (peerUsername: string) => {
  const notificationData = {
    notificationContent: `Waiting for a response from ${peerUsername}`,
    notificationType: 'is-warning',
    isLoading: true,
    isActive: true,
  }

  store.dispatch(setNotification(notificationData))
}

export const setNotificatioInviteDeclined = (peer: User) => {
  const notificationData = {
    notificationContent: `${peer.username} is not able to chat`,
    notificationType: 'is-warning',
    isLoading: false,
    isActive: true,
  }
  store.dispatch(setNotification(notificationData))
  setTimeout(() => store.dispatch(resetNotification()), 5000)
}