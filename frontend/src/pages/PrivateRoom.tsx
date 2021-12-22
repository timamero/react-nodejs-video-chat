import React from 'react';
import Layout from '../components/Layout';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Chat from '../components/Chat';
import { Navigate } from 'react-router-dom';

const PrivateRoom = () => {
  const dispatch = useAppDispatch()
  const room = useAppSelector(state => state.room)
  const userId = useAppSelector(state => state.user.id)

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
        {userHasAccess ? <Chat /> : <p>No access</p>}
      </Layout>
    )
  }
}

export default PrivateRoom