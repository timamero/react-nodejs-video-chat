import React from 'react';
import Layout from '../components/Layout';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';

const PrivateRoom = () => {
  const navigate = useNavigate()
  const room = useAppSelector(state => state.room)
  const userId = useAppSelector(state => state.user.id)

  const userHasAccess = room.users.includes(userId)

  if (!userHasAccess) {
    navigate('/')
  }

  // if user leaves room and comes back, get room data again, use a useEffect

  return (
    <Layout>
      Private chat room
      
      {userHasAccess ? <p>User has access</p> : <p>No access</p>}
    </Layout>
  )
}

export default PrivateRoom