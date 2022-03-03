import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector } from '../app/hooks';

const Home = () => {
  const username = useAppSelector(state => state.user.username)

  return (
    <Layout>
      {username
        ? <p className="is-size-5 has-text-centered">Welcome {username}</p>
        : <p className="is-size-5 has-text-centered">Create a username to chat.</p>
      }
      {!username 
       ? 
        <NewUserForm />
      :
        <ActiveUsers />
      } 
    </Layout>
  )
}

export default Home