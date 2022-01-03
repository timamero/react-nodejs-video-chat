import React, { useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
// import Chat from '../components/Chat';
import { Navigate } from 'react-router-dom';
import { selectRoom } from '../app/features/roomSlice';
import { selectUserId } from '../app/features/userSlice';
// import { store } from '../app/store';
// import { selectRoom } from '../app/hooks';
// import { createSelector, createDraftSafeSelector } from '@reduxjs/toolkit';
// import { RootState } from '../app/store';
import { SocketContext } from '../context/socket';

const PrivateRoom = () => {
  console.log('privateRoom rendered')
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()
  const room = useAppSelector(state  => selectRoom(state))
  const userId = useAppSelector(state => selectUserId(state))

  useEffect(() => {
    console.log('remove enter chat room listener')
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
        {userHasAccess ? <p>Has access</p> : <p>No access</p>}
        {/* {userHasAccess ? <Chat /> : <p>No access</p>} */}
      </Layout>
    )
  }
}

export default PrivateRoom