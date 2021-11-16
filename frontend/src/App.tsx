import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { SocketContext } from './context/socket';
import Room from './components/Room';
import Home from './pages/Home';
import { useAppDispatch } from './app/hooks';
import { setNewUser } from './app/features/userSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)

  useEffect(() => {
    const usernameFromLocalStorage = window.localStorage.getItem('chat-username')

    if (usernameFromLocalStorage) {
      dispatch(setNewUser(usernameFromLocalStorage))
    }
  }, [dispatch])

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
