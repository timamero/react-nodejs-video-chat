import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { resetNotification } from '../app/features/notificationSlice';
import { setRoom } from '../app/features/roomSlice';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import { SocketContext } from '../context/socket';

interface RoomData {
  roomId: string;
  users: [string];
}

const Home = () => {
  console.log('home rendered')
  const navigate = useNavigate()
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();

  const username = useAppSelector(state => state.user.username)
  const notificationActive = useAppSelector(state => state.notification.isActive)

  const handleEnterChat = useCallback((roomData: RoomData) => {
    dispatch(resetNotification())
    dispatch(setRoom({ roomId: roomData.roomId, users: roomData.users}))
    navigate(`/p-room/${roomData.roomId}`)
  }, [dispatch, navigate])

  useEffect(() => {
    // Moved 'enter chat room' socket listener from App to Home because the navigate method had errors inside App
    socket.on('enter chat room', handleEnterChat)

    return () => {
      socket.off('enter chat room', handleEnterChat)
    }
  }, [socket, handleEnterChat])

  return (
    <Layout>
      {notificationActive && <Notification/>}
      {!username 
       ? 
        <NewUserForm />
      :
        <ActiveUsers />
      } 
      <Modal />
    </Layout>
  )
}

export default Home