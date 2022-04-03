/**
 * Private room button menu
 */
import React from 'react';
// import { SocketContext } from '../../../context/socket';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setChatVisbility } from '../../../app/features/roomSlice';
import { sendEndChat } from '../../../services/socket/publishers';
// import { setIsBusy } from '../../../app/features/userSlice';

const RoomOptions: React.FC = () => {
  // const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const room = useAppSelector(state => state.room);
  const isTextChatVisible = useAppSelector(state => state.room.isTextChatVisible);

  const handleEndClick = () => {
    sendEndChat(room.roomId);
    // dispatch(setIsBusy(false));
    // socket.emit('end chat', room.roomId);
  };

  const handleToggleChat = () => {
    dispatch(setChatVisbility(!isTextChatVisible));
  };

  return (
    <div className="mt-4 mb-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger mr-1" onClick={handleEndClick}>End Chat</button>
      <button className="button is-primary mr-1" onClick={handleToggleChat}>{isTextChatVisible ? 'Hide Chat' : 'Show Chat'}</button>
    </div>
  );
};

export default RoomOptions;