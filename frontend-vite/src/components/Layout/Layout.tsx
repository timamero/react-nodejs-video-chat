import type { FC, ReactNode } from 'react';
// import { useAppSelector } from '../../app/hooks';
import Header from './Header';
import Navbar from './Navbar';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Header />
      <div className="section is-flex-grow-1 is-flex is-flex-direction-column">
        {children}
      </div>
    </>
  );
};

export default Layout;
