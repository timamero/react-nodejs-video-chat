import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation()
  return (
    <div id="header">
      {location.pathname === "/" && <h1 className="title is-1 has-text-centered pt-2">Chat App</h1>}
    </div>
  )
}

export default Header;