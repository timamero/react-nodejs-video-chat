/**
 * Socket callbacks for setting notification
 */
import { setNotification } from "../../../app/features/notificationSlice";
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