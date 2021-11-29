import React, { useContext} from "react";
import { setModal } from "../app/features/modalSlice";
import { User } from "../app/features/types";
import { useAppDispatch } from '../app/hooks';
import { SocketContext } from "../context/socket";


interface ActiveUserItemProps {
  user: User;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ user }) => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();
  
  const handleInviteToChatClick = () => {
    const modalData = {
      modalContent: `Would you like to invite ${user.username} to private chat?`,
      confirmBtnText: 'Yes, send invite.',
      declineBtnText: 'No, cancel invite.',
      isActive: true
    }
    dispatch(setModal(modalData))

    // Send server event when user invites another user to a private chat
    socket.emit('invite private chat', user.id)
  }

  return (
    <div className="panel-block is-active is-flex is-flex-direction-row is-justify-content-center">
      <p className="mx-4">{user.username}</p>
      <button onClick={handleInviteToChatClick} className="button is-link is-light">Invite to Chat</button>
    </div>
  )
}

export default ActiveUserItem;