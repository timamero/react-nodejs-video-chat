/**
 * Private room button menu
 */
import React, { useContext } from "react";
import { SocketContext } from "../context/socket";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setChatVisbility } from "../app/features/roomSlice";

const RoomOptions = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch()

  const room = useAppSelector(state => state.room)
  const isChatVisible = useAppSelector(state => state.room.isChatVisible)

  const handleEndClick = () => {
    socket.emit('end chat', room.roomId)
  }

  const handleToggleChat = () => {
    dispatch(setChatVisbility(!isChatVisible))
  }

  return (
    <div className="mt-4 mb-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger mr-1" onClick={handleEndClick}>End Chat</button>
      <button className="button is-primary mr-1" onClick={handleToggleChat}>{isChatVisible ? 'Hide Chat' : 'Show Chat'}</button>
    </div>
  )
}

export default RoomOptions;