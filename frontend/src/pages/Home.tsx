import React, { useContext, useEffect } from 'react';
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
  const notifiactionActive = useAppSelector(state => state.notification.isActive)

  useEffect(() => {
    // had to move this socket from App to Home because the navigate method had errors inside App
    const callback = (roomData: RoomData) => {
      console.log('recieved') // repeated 3-6 times
      dispatch(resetNotification())
      dispatch(setRoom({ roomId: roomData.roomId, users: roomData.users}))
      navigate(`/p-room/${roomData.roomId}`)
    }
    socket.on('enter chat room', callback)

    return () => {
      socket.off('enter chat room', callback)
    }
  })

  return (
    <Layout>
      {notifiactionActive && <Notification/>}
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