import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { resetNotification } from '../app/features/notificationSlice';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import { SocketContext } from '../context/socket';

const Home = () => {
  const navigate = useNavigate()
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();

  const username = useAppSelector(state => state.user.username)
  const notifiactionActive = useAppSelector(state => state.notification.isActive)

  // had to move this socket from App to Home because the navigate method had errors inside App
  socket.on('enter chat room', roomId => {
    console.log('enter room: ', roomId)
    dispatch(resetNotification())
    navigate(`/p-room/${roomId}`)
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