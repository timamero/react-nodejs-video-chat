/**
 * Socket event emitters
 */
import { socket } from '../../context/socket';
import { store } from '../../app/store';

/**
 * Send socket invite for user entering room
 */
export const sendUserEntered = (username: string): void => {
  socket.emit('user entered', username);
};

/**
 * Send socket event to send invitation request to peer
 */
export const sendInvite = (peerId: string): void => {
  socket.emit('invite private chat', peerId);
};

/**
 * Send socket event to accept invitation to chat
 */
export const sendInviteAccepted = (peerId: string): void => {
  socket.emit('invite accepted', peerId);
};

/**
 * Send socket event to decline invitation to chat
 */
export const sendDeclineInvite = (peerId: string): void => {
  socket.emit('decline invite', peerId);
};

/**
 * Send socket event to start RTC peer connection process
 */
export const sendVideoInvite = (): void => {
  const roomId = store.getState().room.roomId;
  socket.emit('video request accepted', roomId);
};

/**
 * Send socket event to update user list
 */
export const sendUpdateUserList = (): void => {
  socket.emit('update user list');
};

/**
 * Send socket event to end chat
 */
export const sendEndChat = (roomId: string): void => {
  socket.emit('end chat', roomId);
};

/**
 * Send socket event to remove logged out user from database
 */
export const sendRemoveUser = (): void => {
  socket.emit('user exit');
};