import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";

const Layout: React.FC = ({children}) => {
  return (
    <div className="is-flex is-flex-direction-column is-flex-grow-1">
      <Navbar />
      <Header />
      {children}
    </div>
  )
}

export default Layout;