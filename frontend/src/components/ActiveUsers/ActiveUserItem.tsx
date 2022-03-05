import React from "react";
import { User } from "../../app/features/types";
import { handleInviteToChatClick } from '../../services/publishers';

interface ActiveUserItemProps {
  user: User;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ user }) => {

  return (
    <div className="panel-block is-active is-flex is-flex-direction-row is-justify-content-center">
      <p className="mx-4">{user.username}</p>
      <button onClick={() => handleInviteToChatClick(user.socketId, user.username)} className="button is-link is-light">Invite to Chat</button>
    </div>
  )
}

export default ActiveUserItem;