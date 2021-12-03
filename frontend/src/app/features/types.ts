export interface User {
  id: string;
  username: string;
}

export interface Modal {
  modalContent: string;
  confirmBtnText: string;
  declineBtnText: string;
  isActive: boolean;
  peerId: string | null;
  socketEvent: string;
}

export interface Notification {
  notificationContent: string;
  notificationType: string;
  isLoading: boolean;
  isActive: boolean;
}