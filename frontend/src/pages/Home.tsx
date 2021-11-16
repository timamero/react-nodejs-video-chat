import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import NewUserForm from '../components/NewUserForm';
import Header from '../components/Header';

const Home = () => {
  return (
    <div>
      <div>
        <Header />
        <NewUserForm />
        <ActiveUsers />
      </div>
    </div>
  )
}

export default Home