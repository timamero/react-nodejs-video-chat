import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  return (
    <nav id="navbar" className="navbar is-fixed-top" role="navigation"  aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <span className="icon">
          <i className="fas fa-comments"></i>
          </span>
        </Link>

        <div onClick={() => setIsMenuActive(!isMenuActive)} role="button" className={`${isMenuActive && 'is-active'} navbar-burger`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>
      <div className={`${isMenuActive && 'is-active'} navbar-menu`}>
        <div className="navbar-end">
          <Link to="/" className="navbar-item has-text-centered">
            <span className="icon">
              <i className="fas fa-home p-1"></i>
            </span>
          </Link>
          <Link to="/" className="navbar-item has-text-centered">
            <span className="icon">
              <i className="fas fa-info-circle p-1"></i>
            </span>
          </Link>
          <div className='buttons is-flex is-flex-direction-row is-justify-content-center'>
            <button className="button is-light">
              Logout
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  )
}

export default Navbar