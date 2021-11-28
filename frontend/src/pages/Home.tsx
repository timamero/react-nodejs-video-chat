import React from 'react';
import ActiveUsers from '../components/ActiveUsers';
import Layout from '../components/Layout';
import NewUserForm from '../components/NewUserForm';
import { useAppSelector } from '../app/hooks';
import Modal from '../components/Modal';

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
      <Modal modalContent={modalContent} confirmBtnText={confirmBtnText} declineBtnText={declineBtnText} isActive={isActive}/>
    </Layout>
  )
}

export default Home