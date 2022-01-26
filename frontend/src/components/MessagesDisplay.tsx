import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/socket";
import Message from './Message';
import { useAppSelector } from '../app/hooks';

export interface message {
  content: string;
  id: number;
  className: string;
}

const MessagesDisplay: React.FC = () => {
  const socket = useContext(SocketContext)
  const userId = useAppSelector(state => state.user.id)
  const [messages, setMessages] = useState<message[]>([])

  const messageEndRef = useRef<null | HTMLDivElement>(null)

  const generateRandomNum = () => {
    return Math.floor((Math.random() * 10000))
  }

  const scrollToBottom = () => {
    messageEndRef.current!.scrollIntoView({ behavior: 'smooth'})
  }

  useEffect(() => {
    socket.once('receive chat message', ( messageData ) => {
      const firstMessageClassName = messages.length === 0 ? 'mt-auto' : ''
      const userClassName = messageData.userId === userId ? 'peer1-message' : 'peer2-message'
      const newMessage = {
        content: messageData.msg,
        userId: messageData.userId,
        className: `${firstMessageClassName} ${userClassName}`,
        id: generateRandomNum()
      }
      setMessages(messages.concat(newMessage))
    })
  }, [socket, messages, userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    // <div className="section is-flex-grow-1">
    // <div id="messageDisplay" className="container is-widescreen is-flex-grow-1 box is-flex is-flex-direction-column">
    <div id="messageDisplay" className="is-flex-grow-1 box is-flex is-flex-direction-column">
      {messages.map(message => <Message message={message.content} key={message.id} className={message.className}/>)}
      <div ref={messageEndRef} />
    </div>
    
  )
}

export default MessagesDisplay;