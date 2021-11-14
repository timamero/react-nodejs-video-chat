import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setNewUser } from "../store/userSlice";

const NewUserForm = () => {
  const dispatch = useDispatch();

  const [usernameInput, setUsernameInput] = useState<string>('')

  const handleUsernameSubmit = (event: FormEvent) => {
    event.preventDefault()

    window.localStorage.setItem('chat-username', usernameInput)
    dispatch(setNewUser(usernameInput))
    setUsernameInput('')
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