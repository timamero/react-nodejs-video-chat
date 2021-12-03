import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector } from '../app/hooks';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

const Home = () => {
  const username = useAppSelector(state => state.user.username)
  const notifiactionActive = useAppSelector(state => state.notification.isActive)

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