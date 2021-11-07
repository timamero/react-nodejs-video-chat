import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface MessageProps {
  message: string;
}

interface message {
  content: string;
  id: number;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="message box">
      {message}
    </div>
  )
}

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
    <div className="App container">
      <div id="chatContainer" className="is-flex is-flex-direction-column">
        <div id="display" className="box is-flex-grow-5">
          <div id="messageContainer" className="is-flex is-flex-direction-column is-justify-content-flex-end">
            {messages.map(message => <Message message={message.content} key={message.id}/>)}
          </div>  
        </div>
        <form id="form" onSubmit={handleMessageSubmit} className="is-flex is-flex-direction-row mb-2">
          <input 
            type="text" 
            name="message" 
            id="message" 
            className="input"/>
          <button type="submit" className="button is-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
