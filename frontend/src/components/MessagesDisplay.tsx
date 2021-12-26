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

  socket.on('receive chat message', ( messageData ) => {
    const newMessage = {
      content: messageData.msg,
      userId: messageData.userId,
      id: generateRandomNum()
    }
    console.log('new message data', newMessage)
    setMessages(messages.concat(newMessage))
  })

  return (
    <div id="display" className="box is-fullheight">
      <div id="messageContainer" className="is-flex is-flex-direction-column is-justify-content-flex-end">
        {messages.map(message => <Message message={message.content} key={message.id}/>)}
      </div>  
    </div>
  )
}

export default MessagesDisplay;