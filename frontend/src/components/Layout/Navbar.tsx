import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav id="navbar" className="navbar" role="navigation"  aria-label="main navigation">
      <div className="navbar-menu is-active">
        <div className="navbar-end">
        <Link to="/" className="navbar-item has-text-centered">Home</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar