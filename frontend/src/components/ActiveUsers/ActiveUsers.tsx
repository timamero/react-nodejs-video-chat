import React from "react";
import { useAppSelector } from "../../app/hooks";
import ActiveUserItem from "./ActiveUserItem";

const ActiveUsers = () => {
  const activeUsers = useAppSelector(state => state.activeUsers.users);
  const appId = useAppSelector(state => state.user.socketId);

  return (
    <div id="activeUsersList" className="panel is-dark mt-4">
      <p className="panel-heading">
        Active Users
      </p>
      {activeUsers.filter(user => user.socketId !== appId).length 
        ? 
        activeUsers
          .filter(user => user.socketId !== appId)
          .map(user => (
            <ActiveUserItem key={user.socketId} user={user} />
        ))
        :
        <p className="panel-block is-active">
            No active users
        </p>
      }   
    </div>
  )
};

export default ActiveUsers;