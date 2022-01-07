import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector } from '../app/hooks';
// import Modal from '../components/Modal';
import Notification from '../components/Notification';

const Home = () => {
  const username = useAppSelector(state => state.user.username)
  const notificationActive = useAppSelector(state => state.notification.isActive)

  return (
    <Layout>
      {username
        ? <p className="is-size-5 has-text-centered">Welcome {username}</p>
        : <p className="is-size-5 has-text-centered">Create a username to chat.</p>
      }
      {notificationActive && <Notification/>}
      {!username 
       ? 
        <NewUserForm />
      :
        <ActiveUsers />
      } 
      {/* <Modal /> */}
    </Layout>
  )
}

export default Home