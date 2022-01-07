import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Modal from "./Modal";

const Layout: React.FC = ({children}) => {
  return (
    <div className="is-flex is-flex-direction-column is-flex-grow-1">
      <Navbar />
      <Header />
      {children}
      <Modal />
    </div>
  )
}

export default Layout;