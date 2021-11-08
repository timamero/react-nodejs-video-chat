import React, { useState, useContext } from "react";
import { SocketContext } from "../context/socket";
import Message from './Message';

export interface message {
  content: string;
  id: number;
}

const MessagesDisplay: React.FC = () => {
  const socket = useContext(SocketContext)
  const [messages, setMessages] = useState<message[]>([])

  const generateRandomNum = () => {
    return Math.floor((Math.random() * 10000))
  }

  // if (socket) {
  socket.on('chat message', function(msg: string) {
    const newMessage = {
      content: msg,
      id: generateRandomNum()
    }
    setMessages(messages.concat(newMessage))
  })
  // }

  return (
    <div id="display" className="box is-flex-grow-5">
      <div id="messageContainer" className="is-flex is-flex-direction-column is-justify-content-flex-end">
        {messages.map(message => <Message message={message.content} key={message.id}/>)}
      </div>  
    </div>
  )
}

export default MessagesDisplay;