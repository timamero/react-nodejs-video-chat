import React, { useContext } from "react";
import { useAppSelector } from '../app/hooks';
import { SocketContext } from "../context/socket";

const RoomOptions = () => {
  const socket = useContext(SocketContext)
  // const dispatch = useAppDispatch()

  const room = useAppSelector(state => state.room)

  const handleEndClick = () => {
    console.log('end chat')
    socket.emit('end chat', room.roomId)
  }

  // const handleStartVideoClick = () => {
  //   console.log('start video')
  //   dispatch(setVideoState(true))
  //   socket.emit('start video request', room.users)
  // }

  return (
    <div className="mt-4 mb-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger mr-1" onClick={handleEndClick}>End Chat</button>
    </div>
  )
}

export default RoomOptions;