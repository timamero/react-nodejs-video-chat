import React from 'react';
import NewUserForm from '../components/NewUserForm';

const Home = () => {
  return (
    <div>
      <div id="activeUsersList">
        <NewUserForm />
        <h2>Active Users</h2>
        placeholder for active users
      </div>
    </div>
  )
}

export default Home