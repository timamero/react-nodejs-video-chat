import React from "react";
import { useAppSelector } from "../app/hooks";

const ActiveUsers = () => {
  const activeUsers = useAppSelector(state => state.activeUsers.users)
  const appId = useAppSelector(state => state.user.id)
  console.log('appId', appId)

  console.log('activeUsers', activeUsers)
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
          <p key={user.id} className="panel-block is-active">
            {user.username}
          </p>
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