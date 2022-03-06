/**
 * Private video and text message chat room between two peers
 */
import React, { useEffect, useContext, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { addMessage } from "../app/features/roomSlice";
import Layout from '../components/Layout';
import RoomOptions from '../components/RoomOptions';
import VideoDisplay from '../components/VideoDisplay';
import MessagesDisplay from '../components/MessagesDisplay';
import MessageForm from '../components/MessageForm';
import { generateRandomNum } from '../util/helper';

const PrivateRoom = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()
  
  const room = useAppSelector(state  => state.room)
  const userId = useAppSelector(state => state.user.socketId)
  const isTextChatVisible = useAppSelector(state => state.room.isTextChatVisible)
  const messages = useAppSelector(state => state.room.messages)

  const userHasAccess = room.users.includes(userId)

  const setMessages = useCallback((message) => {
    dispatch(addMessage(message))
  }, [dispatch])

  useEffect(() => {
    socket.removeAllListeners('enter chat room')
  }, [socket])
  
  useEffect(() => {
    socket.once('receive chat message', ( messageData ) => {
      const firstMessageClassName = messages.length === 0 ? 'mt-auto' : ''
      const userClassName = messageData.userId === userId ? 'peer1Message' : 'peer2Message'
      const newMessage = {
        content: messageData.msg,
        userId: messageData.userId,
        className: `${firstMessageClassName} ${userClassName}`,
        id: generateRandomNum()
      }
      setMessages(newMessage)
    })
  }, [socket, messages, userId, setMessages])

  if (!userHasAccess) {
    const notificationData = {
      notificationContent: 'You do not have access to this room.',
      notificationType: 'is-warning',
      isLoading: false,
      isActive: true,
      }

    dispatch(setNotification(notificationData))
    setTimeout(() => dispatch(resetNotification()), 5000)
    return <Navigate to="/" />
    
  } else {
    return (
      <Layout>
        {userHasAccess 
        ? 
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
        : <p>No access</p>}
      </Layout>
    )
  }
}

export default PrivateRoom