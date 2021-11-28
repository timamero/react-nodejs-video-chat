import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector } from '../app/hooks';

const Home = () => {
  const username = useAppSelector(state => state.user.username)
  return (
    <Layout>
      {!username 
       ? 
        <NewUserForm />
      :
        <ActiveUsers />
      } 
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content box">
          Invited to chat
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    </Layout>
  )
}

export default Home