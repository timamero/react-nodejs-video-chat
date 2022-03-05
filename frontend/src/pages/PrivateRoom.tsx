import React, { useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import MessageForm from '../components/MessageForm';
import MessagesDisplay from '../components/MessagesDisplay';
import RoomOptions from '../components/RoomOptions';
import { Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import VideoDisplay from '../components/VideoDisplay';

const PrivateRoom = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()
  const room = useAppSelector(state  => state.room)
  const userId = useAppSelector(state => state.user.socketId)
  const isChatVisible = useAppSelector(state => state.room.isChatVisible)

  useEffect(() => {
    socket.removeAllListeners('enter chat room')
  }, [socket])
  const userHasAccess = room.users.includes(userId)

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
                isChatVisible &&
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