import React, { useContext, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './context/socket';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setNewUser, setId } from './app/features/userSlice';
import { getAllActiveUsers } from './app/features/activeUsersSlice';
import { resetRoom, setRoom } from './app/features/roomSlice';
import { setModal } from './app/features/modalSlice';
import { setNotification, resetNotification } from './app/features/notificationSlice';
import './styles/app.scss'
import { User } from './app/features/types';
import TestRoom from './pages/TestRoom';
import Home from './pages/Home';
import PrivateRoom from './pages/PrivateRoom';
import { sendVideoInvite } from './services/socket/publishers';

interface RoomData {
  roomId: string;
  users: [string];
}

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const activeUsers = useAppSelector(state => state.activeUsers.users)
  const currentUser = useAppSelector(state => state.user.socketId)

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
    const inviter = activeUsers.find((user: User) => user.socketId === inviterId)

    if (inviter) {
        const modalData = {
        modalName: 'private chat request',
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
    const peer = activeUsers.find((user: User) => user.socketId === inviteeId)
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

  const handleEnterChat = useCallback((roomData: RoomData) => {
    dispatch(resetNotification())
    dispatch(setRoom({ roomId: roomData.roomId, users: roomData.users, isTextChatVisible: false, messages: [] }))
    navigate(`/p-room/${roomData.roomId}`)
    if (roomData.users[0] === currentUser) {
      // Start RTC Peer Connection
      sendVideoInvite()
    }
  }, [dispatch, navigate, currentUser])

  const handleCloseChatRoom = useCallback(() => {
    navigate('/')
    dispatch(resetRoom())
  }, [navigate, dispatch])

  useEffect(() => {
    const usernameFromLocalStorage = window.localStorage.getItem('chat-username')

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
    socket.on('enter chat room', handleEnterChat)
    socket.on('close chat room', handleCloseChatRoom)

    return () => {
      socket.off('get user list', handleAddUsers)
      socket.off('get socket id', handleSetId)
      socket.off('invite requested', handleInviteRequested)
      socket.off('invite declined', handleInviteDeclined)
      socket.off('enter chat room', handleEnterChat)
      socket.off('closeChatRoom', handleCloseChatRoom)
    }
  }, 
  [socket, 
  handleAddUsers,
  handleSetId,
  handleInviteRequested,
  handleInviteDeclined,
  handleEnterChat,
  handleCloseChatRoom])
 
  return (
    <div className="App is-flex is-flex-direction-column">
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/p-room/:id' element={<PrivateRoom />} />
        <Route path='/testroom' element={<TestRoom />} />
      </Routes>
    </div>
  );
}

export default App;
