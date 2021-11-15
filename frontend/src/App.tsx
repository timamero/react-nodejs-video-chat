import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { SocketContext } from './context/socket';
import Room from './components/Room';
import Home from './pages/Home';

const App: React.FC = () => {
  const socket = useContext(SocketContext)

  if (socket) {
    socket.connect()

    socket.on('connect', () => {
      console.log('react connected')
    }) 
  }

  return (
    <Router>
      <div className="App">
        <nav id="navbar" className="navbar" role="navigation"  aria-label="main navigation">
          <div className="navbar-menu is-active">
            <div className="navbar-end">
            <Link to="/" className="navbar-item has-text-centered">Home</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/testroom' element={<Room />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
