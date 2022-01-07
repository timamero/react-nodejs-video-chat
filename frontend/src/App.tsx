import React, { useContext, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './styles/app.scss'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './context/socket';
import TestRoom from './pages/TestRoom';
import Home from './pages/Home';
import { User } from './app/features/types';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setNewUser, setId } from './app/features/userSlice';
import { getAllActiveUsers } from './app/features/activeUsersSlice';
import { setModal } from './app/features/modalSlice';
import { setNotification, resetNotification } from './app/features/notificationSlice';
import PrivateRoom from './pages/PrivateRoom';

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const activeUsers = useAppSelector(state => state.activeUsers.users)

  const handleSetNewUser = useCallback((usernameFromLocalStorage) => {
    dispatch(setNewUser(usernameFromLocalStorage))
  }, [dispatch])

  const handleAddUsers = useCallback((users: User[]) => {
    // Get list of active users from server
    dispatch(getAllActiveUsers(users))
  }, [dispatch])

  const handleSetId = useCallback(id => {
    // Setting the socket ID as the current user's ID
    dispatch(setId(id))
  }, [dispatch])

  const handleInviteRequested = useCallback(inviterId => {
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
  }, [dispatch, activeUsers])

  const handleInviteDeclined = useCallback(inviteeId => {
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
  }, [dispatch, activeUsers])

  const handleCloseChatRoom = useCallback(() => {
    console.log('request to end chat for all')
    navigate('/')
  }, [navigate])

  useEffect(() => {
    console.log('local storage useEffect')
    const usernameFromLocalStorage = window.localStorage.getItem('chat-username')

    // If username is found in localStorage, 
    // set the current user's username to the one found in localStorage
    if (usernameFromLocalStorage) {
      console.log('getting user from local storage')
      socket.emit('user entered', usernameFromLocalStorage)
      handleSetNewUser(usernameFromLocalStorage)
    }

  }, [socket, handleSetNewUser])

  useEffect(() => {
    /*
    * Socket event listeners
    */
    socket.once('connect', () => {
      console.log('Connected to server')
    })
    socket.on('get user list', handleAddUsers)
    socket.on('get socket id', handleSetId)
    socket.on('invite requested', handleInviteRequested)
    socket.on('invite declined', handleInviteDeclined)
    socket.on('close chat room', handleCloseChatRoom)

    return () => {
      socket.off('get user list', handleAddUsers)
      socket.off('get socket id', handleSetId)
      socket.off('invite requested', handleInviteRequested)
      socket.off('invite declined', handleInviteDeclined)
      socket.off('closeChatRoom', handleCloseChatRoom)
    }
  }, [socket, handleAddUsers, handleSetId, handleInviteRequested, handleInviteDeclined, handleCloseChatRoom])
 
  return (
    // <Router>
      <div className="App is-flex is-flex-direction-column">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/p-room/:id' element={<PrivateRoom />} />
          <Route path='/testroom' element={<TestRoom />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App;
