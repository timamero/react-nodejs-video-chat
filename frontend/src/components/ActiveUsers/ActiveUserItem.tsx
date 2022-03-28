/**
 * Active user list item
 */
import React from "react";
import { User } from "../../util/types";
import { setModalInviteToChat } from '../../util/middleware/appActions/modal';

interface ActiveUserItemProps {
  user: User;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ user }) => {
  return (
    <div className="panel-block is-active is-flex is-flex-direction-row is-justify-content-center">
      <p className="mx-4">{user.username}</p>
      {!user.isBusy 
        ?
        <button onClick={() => setModalInviteToChat(user.socketId, user.username)} className="button is-link is-light">Invite to Chat</button>
        :
        <span className="tag is-warning is-light">Not Available</span>
      }
    </div>
  )
}

export default ActiveUserItem;