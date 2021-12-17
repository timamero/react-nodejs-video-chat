export interface User {
  id: string;
  username: string;
}

export interface ActiveUsersState {
  users: User[];
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

export interface Room {
  roomId: string;
  users: string[];
}