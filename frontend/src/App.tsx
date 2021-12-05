import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './styles/app.scss'
import { SocketContext } from './context/socket';
import TestRoom from './pages/TestRoom';
import Home from './pages/Home';
import { User } from './app/features/types';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setNewUser, setId } from './app/features/userSlice';
import { getAllActiveUsers } from './app/features/activeUsersSlice';
import { setModal } from './app/features/modalSlice';
import { setNotification, resetNotification } from './app/features/notificationSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)

  const activeUsers = useAppSelector(state => state.activeUsers.users)
  console.log('app - active user:', activeUsers)

  useEffect(() => {
    const usernameFromLocalStorage = window.localStorage.getItem('chat-username')

    // If username is found in localStorage, 
    // set the current user's username to the one found in localStorage
    if (usernameFromLocalStorage) {
      socket.emit('user entered', usernameFromLocalStorage)
      dispatch(setNewUser(usernameFromLocalStorage))
    }
  }, [dispatch, socket])

  // Manually connect to socket
  socket.connect()

  /*
   * Socket event listeners
  */
  socket.on('connect', () => {
    console.log('Connected to server')
  })
  socket.on('get user list', users => {
    // Get list of active users from server
    console.log('receiving user list', users)
    dispatch(getAllActiveUsers(users))
  })
  socket.on('get socket id', id => {
    // Setting the socket ID as the current user's ID
    console.log('setting app user id')
    dispatch(setId(id))
  })
  socket.on('invite requested', inviterId => {
    console.log('invite from ', inviterId)
    const inviter = activeUsers.find((user: User) => user.id === inviterId)

    if (inviter) {
        const modalData = {
        modalContent: `${inviter.username} has invited you to a private chat?`,
        confirmBtnText: 'Yes, accept invite.',
        declineBtnText: 'No, decline invite.',
        isActive: true,
        peerId: inviterId,
        socketEvent: 'invite requested'
      }

      dispatch(setModal(modalData))
    }  
  })
  socket.on('invite declined', (inviteeId) => {
    console.log('invitation to chat was declined by', inviteeId)
    const peer = activeUsers.find((user: User) => user.id === inviteeId)
    if (peer) {
      const notificationData = {
      notificationContent: `${peer.username} is not able to chat`,
      notificationType: 'is-warning',
      isLoading: false,
      isActive: true,
      }
      dispatch(setNotification(notificationData))
      setTimeout(() => dispatch(resetNotification()), 5000)
    } 
  })
  socket.on('enter chat room', roomId => {
    console.log('enter room: ', roomId)
    dispatch(resetNotification())
  })
 
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/testroom' element={<TestRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
