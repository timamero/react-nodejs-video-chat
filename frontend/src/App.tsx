import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Chat from './components/Chat';
import { message } from './components/MessagesDisplay';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [messages, setMessages] = useState<message[]>([])

  const generateRandomNum = () => {
    return Math.floor((Math.random() * 10000))
  }

  useEffect(() => {
    const newSocket = io("ws://localhost:3001"); 
    setSocket(newSocket)
  }, [])

  if (socket) {
    socket.connect()

    socket.on('connect', () => {
      console.log('react connected')
    }) 
  }

  const handleMessageSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      message: { value: string };
    };

    const message = target.message.value

    if (message && socket) {
      socket.emit('chat message', message);
      target.message.value = '';
    }
  }

  if (socket) {
    socket.on('chat message', function(msg) {
      const newMessage = {
        content: msg,
        id: generateRandomNum()
      }
      setMessages(messages.concat(newMessage))
    })
  }

  return (
    <div className="App container is-fluid">
      <Chat messages={messages} handleMessageSubmit={handleMessageSubmit}/>
    </div>
  );
}

export default App;
