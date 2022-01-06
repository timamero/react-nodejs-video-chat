import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../app/hooks";
import { SocketContext } from "../context/socket";

const RoomOptions = () => {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const roomId = useAppSelector(state => state.room.roomId)

  const handleClick = () => {
    console.log('end chat')
    socket.emit('end chat', roomId)
    navigate('/')
  }

  return (
    <div className="mt-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger" onClick={handleClick}>End Chat</button>
    </div>
  )
}

export default RoomOptions;