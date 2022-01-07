import React, { useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Chat from '../components/Chat';
import RoomOptions from '../components/RoomOptions';
import { Navigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import VideoDisplay from '../components/VideoDisplay';

const PrivateRoom = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()
  const room = useAppSelector(state  => state.room)
  const userId = useAppSelector(state => state.user.id)

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
          <div className="is-flex is-flex-direction-column is-flex-grow-1">
            <RoomOptions />
            <VideoDisplay />
            <Chat />
          </div>
        : <p>No access</p>}
      </Layout>
    )
  }
}

export default PrivateRoom