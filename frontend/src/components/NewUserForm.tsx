import React, { useState, FormEvent } from "react";

const NewUserForm = () => {
  const [username, setUsername] = useState<string>('')

  const handleUsernameSubmit = (event: FormEvent) => {
    event.preventDefault()

    window.localStorage.setItem('chat-username', username)
    setUsername('')
  }
  return (
    <form id="usernameForm" className="box" onSubmit={handleUsernameSubmit}>
      <label id="username" htmlFor="usernameInput" className="label">Username</label>
      <div className="control block">
        <input 
          id="usernameInput" 
          className="input" 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
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