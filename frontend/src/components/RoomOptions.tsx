import React from "react";
import { useNavigate } from 'react-router-dom';

const RoomOptions = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    console.log('end chat')
    navigate('/')
  }

  return (
    <div className="mt-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger" onClick={handleClick}>End Chat</button>
    </div>
  )
}

export default RoomOptions;