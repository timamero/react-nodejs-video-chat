import React, { useContext } from 'react';
import { resetModal } from '../app/features/modalSlice';
import { User } from '../app/features/types'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { SocketContext } from '../context/socket';
import { setNotification } from '../app/features/notificationSlice';

const ActionModal: React.FC = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modal);
  const activeUsers = useAppSelector(state => state.activeUsers.users)

  const peerUsername = modalData.peerId ? activeUsers.find((user: User) => modalData.peerId === user.id)!.username : ''
  
  const handleDeclineandCloseModal = () => {
    if (modalData.socketEvent === 'invite requested') {
      // When user declines invite to chat, send server event that invite was declined
      socket.emit('decline invite', modalData.peerId)
    }

    dispatch(resetModal())
  }

  const handleAcceptandCloseModal = () => {
    if (modalData.socketEvent === 'invite private chat') {
      const notificationData = {
        notificationContent: `Wating for a response from ${peerUsername}`,
        notificationType: 'is-warning',
        isLoading: true,
        isActive: true,
      }
      dispatch(setNotification(notificationData))
      socket.emit(modalData.socketEvent, modalData.peerId)
    }

    // When user accepts/confirms, the send server event that invite was accepted
    if (modalData.socketEvent === 'invite requested') {
      socket.emit('invite accepted', modalData.peerId)
    }
    
    dispatch(resetModal())
  }

  return (
    <div className={`modal ${modalData.isActive && 'is-active'}`}>
      <div className="modal-background"></div>
      <div className="modal-content box">
        <p className="has-text-centered is-size-4 my-2">{modalData.modalContent}</p>
        <div className="is-flex is-flex-direction-row is-justify-content-space-around">
          <button onClick={handleAcceptandCloseModal} className="button is-primary">{modalData.confirmBtnText}</button>
          <button onClick={handleDeclineandCloseModal} className="button is-danger">{modalData.declineBtnText}</button>
        </div>
      </div>
      <button onClick={handleDeclineandCloseModal} className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

export default ActionModal