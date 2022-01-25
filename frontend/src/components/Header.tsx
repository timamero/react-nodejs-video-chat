import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation()
  console.log('location header', location.pathname)
  return (
    <div id="header">
      {location.pathname === "/" && <h1 className="title is-1 has-text-centered">Chat App</h1>}
    </div>
  )
}

export default Header;