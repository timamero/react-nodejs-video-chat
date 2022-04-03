/**
 * The Chat component displays the video and text messaging components
 */
import React, { useEffect, useCallback, useContext } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { SocketContext } from '../../context/socket';
import RoomOptions from './RoomOptions/RoomOptions';
import VideoDisplay from './VideoDisplay/VideoDisplay';
import MessagesDisplay from './MessagesDisplay';
import MessageForm from './MessageForm/MessageForm';
import { addMessage } from '../../app/features/roomSlice';
import { generateRandomNum } from '../../util/helper';

const Chat: React.FC = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const isTextChatVisible = useAppSelector(state => state.room.isTextChatVisible);
  const userId = useAppSelector(state => state.user.socketId);
  const messages = useAppSelector(state => state.room.messages);

  const setMessages = useCallback((message) => {
    dispatch(addMessage(message));
  }, [dispatch]);

  const handleReceiveChatMessage = useCallback(( messageData ) => {
    const firstMessageClassName = messages.length === 0 ? 'mt-auto' : '';
    const userClassName = messageData.userId === userId ? 'peer1Message' : 'peer2Message';
    const newMessage = {
      content: messageData.msg,
      userId: messageData.userId,
      className: `${firstMessageClassName} ${userClassName}`,
      id: generateRandomNum()
    };
    setMessages(newMessage);
  }, [messages.length, setMessages, userId]);

  useEffect(() => {
    socket.once('receive chat message', handleReceiveChatMessage);

    return () => {
      socket.off('receive chat message', handleReceiveChatMessage);
    };
  }, [socket, messages, userId, setMessages, handleReceiveChatMessage]);

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
  );
};

export default Chat;