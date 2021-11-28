import React from "react";
import { useAppSelector } from "../app/hooks";
import ActiveUserItem from "./ActiveUserItem";

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
            <ActiveUserItem key={user.id} user={user} />
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