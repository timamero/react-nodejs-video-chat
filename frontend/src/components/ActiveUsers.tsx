import React from "react";
import { useAppSelector } from "../app/hooks";

const ActiveUsers = () => {
  const activeUsers = useAppSelector(state => state.activeUsers.users)
  const appId = useAppSelector(state => state.user.id)

  return (
    <div id="activeUsersList" className="panel">
      <p className="panel-heading">
        Active Users
      </p>
      {activeUsers.filter(user => user.id !== appId).length 
        ? 
        activeUsers
          .filter(user => user.id !== appId)
          .map(user => (
          <div key={user.id} className="panel-block is-active is-flex is-flex-direction-row is-justify-content-center">
            <p className="mx-4">{user.username}</p>
            <button className="button is-link is-light">Invite to Chat</button>
          </div>
        ))
        :
        <p className="panel-block is-active">
            No active users
        </p>
      }   
    </div>
  )
}

export default ActiveUsers;