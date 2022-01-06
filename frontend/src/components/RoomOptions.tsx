import React from "react";

const RoomOptions = () => {
  const handleClick = () => {
    console.log('end chat')
  }

  return (
    <div className="mt-4 is-flex is-flex-direction-row is-justify-content-center">
      <button className="button is-danger" onClick={handleClick}>End Chat</button>
    </div>
  )
}

export default RoomOptions;