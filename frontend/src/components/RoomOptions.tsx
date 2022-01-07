import React, { useContext } from "react";
import { useAppSelector } from '../app/hooks';
import { SocketContext } from "../context/socket";

const RoomOptions = () => {
  const socket = useContext(SocketContext)

  const roomId = useAppSelector(state => state.room.roomId)
  const users = useAppSelector(state => state.room.users)

  const handleEndClick = () => {
    console.log('end chat')
    socket.emit('end chat', roomId)
  }

  const handleVideoClick = () => {
    console.log('start video')
    socket.emit('start video request', users)
  }

  return (
    <div className="mt-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger mr-1" onClick={handleEndClick}>End Chat</button>
      <button className="button is-link ml-1" onClick={handleVideoClick}>Start Video</button>
    </div>
  )
}

export default RoomOptions;