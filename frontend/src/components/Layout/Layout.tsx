import React from 'react';
import { useAppSelector } from '../../app/hooks';
import Header from './Header';
import Navbar from './Navbar';
import Modal from './Modal';
import Notification from './Notification';

const Layout: React.FC = ({ children }) => {
  const notificationActive = useAppSelector(state => state.notification.isActive);

  return (
    <>
      <Navbar />
      <Header />
      {notificationActive && <Notification/>}
      <div className="section is-flex-grow-1 is-flex is-flex-direction-column">{children}</div>
      <Modal />
    </>
  );
};

export default Layout;