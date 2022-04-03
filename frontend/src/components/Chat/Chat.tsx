import React from 'react';
import { useAppSelector } from '../../app/hooks';
import RoomOptions from './RoomOptions';
import VideoDisplay from './VideoDisplay';
import MessagesDisplay from './MessagesDisplay';
import MessageForm from './MessageForm';

const Chat = () => {
  const isTextChatVisible = useAppSelector(state => state.room.isTextChatVisible)

  return (
    <>
      <RoomOptions />
      <div className="privateRoomContent bulma-overlay-mixin-parent">
        <VideoDisplay />
        {
          isTextChatVisible &&
          <div className="chat bulma-overlay-mixin">
            <MessagesDisplay />
            <MessageForm />
          </div>
        }
      </div>
    </>
  )
}

export default Chat;