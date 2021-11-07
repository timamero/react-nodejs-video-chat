import React from "react";
import Message from './Message';

export interface message {
  content: string;
  id: number;
}

interface MessagesDisplayProps {
  messages: message[];
}

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({ messages }) => {
  return (
    <div id="display" className="box is-flex-grow-5">
      <div id="messageContainer" className="is-flex is-flex-direction-column is-justify-content-flex-end">
        {messages.map(message => <Message message={message.content} key={message.id}/>)}
      </div>  
    </div>
  )
}

export default MessagesDisplay;