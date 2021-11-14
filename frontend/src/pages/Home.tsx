import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import NewUserForm from '../components/NewUserForm';

const Home = () => {
  return (
    <div>
      <div id="activeUsersList">
        <NewUserForm />
        <ActiveUsers />
      </div>
    </div>
  )
}

export default Home