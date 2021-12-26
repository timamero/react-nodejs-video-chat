import React from "react";
import MessageForm from './MessageForm';
import MessagesDisplay from './MessagesDisplay';

const Chat: React.FC = () => {
  return (
    <div id="chatContainer" className="is-flex is-flex-direction-column is-justify-content-flex-end is-flex-grow-1">
      <MessagesDisplay />
      <MessageForm />
    </div>
  )
}

export default Chat;