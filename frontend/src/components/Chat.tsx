import React from "react";
import MessageForm from './MessageForm';
import MessagesDisplay from './MessagesDisplay';
import { message } from './MessagesDisplay'

interface ChatProps {
  messages: message[];
  handleMessageSubmit: React.FormEventHandler
}

const Chat: React.FC<ChatProps> = ({ messages, handleMessageSubmit }) => {
  return (
    <div id="chatContainer" className="is-flex is-flex-direction-column">
      <MessagesDisplay messages={messages}/>
      <MessageForm handleMessageSubmit={handleMessageSubmit}/>
    </div>
  )
}

export default Chat;