import React from 'react';
import Layout from '../components/Layout';
import { setNotification, resetNotification } from '../app/features/notificationSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';

const PrivateRoom = () => {
  const navigate = useNavigate()
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
    navigate('/')
    setTimeout(() => dispatch(resetNotification()), 5000)
  }

  // if user leaves room and comes back, get room data and recheck if user has access, use a useEffect

  return (
    <Layout>
      Private chat room
      
      {userHasAccess 
        ? 
          <Chat /> 
        : <p>No access</p>}
    </Layout>
  )
}

export default PrivateRoom