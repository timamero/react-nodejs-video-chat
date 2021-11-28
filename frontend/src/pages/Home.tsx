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
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content box">
          <p className="has-text-centered is-size-4 my-2">Invited to chat</p>
          <div className="is-flex is-flex-direction-row is-justify-content-space-around">
            <button className="button is-primary">Accept</button>
            <button className="button is-danger">Decline</button>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    </Layout>
  )
}

export default Home