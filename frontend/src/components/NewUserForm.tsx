import React, { useState, useContext, FormEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { setNewUser } from "../app/features/userSlice";
import { SocketContext } from "../context/socket";

const NewUserForm = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();
  const [usernameInput, setUsernameInput] = useState<string>('')

  const handleUsernameSubmit = (event: FormEvent) => {
    event.preventDefault()

    window.localStorage.setItem('chat-username', usernameInput)
    dispatch(setNewUser(usernameInput))
    setUsernameInput('')

    // Send server event when a new user creates a username
    socket.emit('user entered', usernameInput)
  }

  return (
    <form id="usernameForm" className="box" onSubmit={handleUsernameSubmit}>
      <label id="username" htmlFor="usernameInput" className="label">Username</label>
      <div className="control block">
        <input 
          id="usernameInput" 
          className="input" 
          type="text" 
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)} />
      </div>
      <div className="control block">
        <button 
          id="submitUsername"
          type="submit" 
          className="button is-primary is-light"
          >
            Submit
          </button>
      </div>
    </form>
  )
}

export default NewUserForm;