import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Modal from "./Modal";

const Layout: React.FC = ({children}) => {
  return (
    <div className="Layout is-flex is-flex-direction-column">
      <Navbar />
      <Header />
      <div className="section is-flex-grow-1 is-flex is-flex-direction-column">{children}</div>
      {/* <div className="section is-flex-grow-1 is-flex is-flex-direction-column">{children}</div> */}
      {/* {children} */}
      <Modal />
    </div>
  )
}

export default Layout;