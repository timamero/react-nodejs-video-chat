import React, { useContext } from "react";
import { setVideoState } from "../app/features/roomSlice";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { SocketContext } from "../context/socket";

const RoomOptions = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()

  const room = useAppSelector(state => state.room)

  const handleEndClick = () => {
    console.log('end chat')
    socket.emit('end chat', room.roomId)
  }

  const handleStartVideoClick = () => {
    console.log('start video')
    dispatch(setVideoState(true))
    socket.emit('start video request', room.users)
  }

  return (
    <div className="mt-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger mr-1" onClick={handleEndClick}>End Chat</button>
      {!room.isVideoOn && <button className="button is-link ml-1" onClick={handleStartVideoClick}>Start Video</button>}
      
    </div>
  )
}

export default RoomOptions;