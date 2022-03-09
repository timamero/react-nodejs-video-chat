import React, { useContext, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './context/socket';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { resetRoom, setRoom } from './app/features/roomSlice';
import { resetNotification } from './app/features/notificationSlice';
import './styles/app.scss'
import TestRoom from './pages/TestRoom';
import Home from './pages/Home';
import PrivateRoom from './pages/PrivateRoom';
import { sendUserEntered, sendVideoInvite } from './services/socket/publishers';
import { setActiveUsers } from './util/middleware/socketActions/activeUsers';
import { setUserId } from './util/middleware/socketActions/user';
import { handleInviteRequested, handleInviteDeclined } from './util/middleware/socketActions/chat';
import { setAppNewUser } from './util/middleware/appActions/user';

interface RoomData {
  roomId: string;
  users: [string];
}

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const currentUser = useAppSelector(state => state.user.socketId)

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
      sendUserEntered(usernameFromLocalStorage)
      setAppNewUser(usernameFromLocalStorage)
    }
  }, [socket])

  useEffect(() => {
    /*
    * Socket event listeners
    */
    socket.once('connect', () => {
      console.log('Connected to server')
    })
    socket.on('get user list', setActiveUsers)
    socket.on('get socket id', setUserId)
    socket.on('invite requested', handleInviteRequested)
    socket.on('invite declined', handleInviteDeclined)
    socket.on('enter chat room', handleEnterChat)
    socket.on('close chat room', handleCloseChatRoom)

    return () => {
      socket.off('get user list', setActiveUsers)
      socket.off('get socket id', setUserId)
      socket.off('invite requested', handleInviteRequested)
      socket.off('invite declined', handleInviteDeclined)
      socket.off('enter chat room', handleEnterChat)
      socket.off('closeChatRoom', handleCloseChatRoom)
    }
  }, 
  [socket, 
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
