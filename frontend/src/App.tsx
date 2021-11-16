import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/testroom' element={<Room />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
