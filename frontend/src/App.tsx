import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { SocketContext } from './context/socket';
import Room from './pages/Room';
import Home from './pages/Home';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setNewUser, setId } from './app/features/userSlice';
import { getAllActiveUsers } from './app/features/activeUsersSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)

  socket.connect()

  useEffect(() => {
    const usernameFromLocalStorage = window.localStorage.getItem('chat-username')

    if (usernameFromLocalStorage) {
      socket.emit('user entered', usernameFromLocalStorage)
      dispatch(setNewUser(usernameFromLocalStorage))
    }
  }, [dispatch, socket])

  
  socket.on('connect', () => {
    console.log('Connected to server')
  })

  socket.on('get user list', users => {
    console.log('receiving user list', users)
    dispatch(getAllActiveUsers(users))
  })

  socket.on('get socket id', id => {
    console.log('setting app user id')
    dispatch(setId(id))
  })
    
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
