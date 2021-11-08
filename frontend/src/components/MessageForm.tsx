import React, { useContext } from "react";
import { SocketContext } from "../context/socket";


const MessageForm: React.FC = () => {
  const socket = useContext(SocketContext)
  
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
  
  return (
    <form id="form" onSubmit={handleMessageSubmit} className="is-flex is-flex-direction-row mb-2">
      <input 
        type="text" 
        name="message" 
        id="message" 
        className="input"/>
      <button type="submit" className="button is-primary">Send</button>
    </form>
  )
}

export default MessageForm;