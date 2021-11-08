import React from "react";
import MessageForm from './MessageForm';
import MessagesDisplay from './MessagesDisplay';

const Chat: React.FC = () => {
  return (
    <div id="chatContainer" className="is-flex is-flex-direction-column">
      <MessagesDisplay />
      <MessageForm />
    </div>
  )
}

export default Chat;