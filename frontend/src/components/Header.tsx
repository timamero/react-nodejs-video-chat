import React from "react";
import { useAppSelector } from "../app/hooks";

const Header = () => {
  const username = useAppSelector(state => state.user.username)

  return (
    <div id="header">
      <h1 className="title is-1 has-text-centered">Chat App</h1>
      {username
        ? <p className="is-size-5 has-text-centered">Welcome {username}</p>
        : <p className="is-size-5 has-text-centered">Create a username to chat.</p>
      }
    </div>
  )
}

export default Header;