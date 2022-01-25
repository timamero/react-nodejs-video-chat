import React, { useContext } from "react";
import { SocketContext } from "../context/socket";
import { useAppSelector } from '../app/hooks';


const MessageForm: React.FC = () => {
  const socket = useContext(SocketContext)

  const roomId = useAppSelector(state => state.room.roomId)

  const handleMessageSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      message: { value: string };
    };

    const messageData = {
      msg: target.message.value,
      roomId
    }

    if (messageData.msg) {
      socket.emit('send chat message', messageData);
      target.message.value = '';
    }
  }
  
  return (
    <form id="form" onSubmit={handleMessageSubmit} className="is-flex is-flex-direction-row mb-2 is-align-self-center">
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