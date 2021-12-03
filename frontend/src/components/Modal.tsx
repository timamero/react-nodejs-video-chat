import React, { useContext } from 'react';
import { resetModal } from '../app/features/modalSlice';
// import { User } from '../app/features/types'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { SocketContext } from '../context/socket';
import { setNotification } from '../app/features/notificationSlice';

const ActionModal: React.FC = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modal);
  const activeUsers = useAppSelector(state => state.activeUsers.users)

  const handleCloseModal = () => {
    dispatch(resetModal())
  }

  const handleAcceptandCloseModal = () => {
    const peerUsername = modalData.peerId ? activeUsers.find(user => modalData.peerId === user.id)!.username : ''
    if (modalData.socketEvent === 'invite private chat') {
      const notificationData = {
        notificationContent: `Wating for a response from ${peerUsername}`,
        notificationType: 'is-warning',
        isLoading: true,
        isActive: true,
      }
      dispatch(setNotification(notificationData))
    }

    // When user accepts/confirms, the corresponding socket event will be sent to server
    socket.emit(modalData.socketEvent, modalData.peerId)
    dispatch(resetModal())
  }

  return (
    <div className={`modal ${modalData.isActive && 'is-active'}`}>
      <div className="modal-background"></div>
      <div className="modal-content box">
        <p className="has-text-centered is-size-4 my-2">{modalData.modalContent}</p>
        <div className="is-flex is-flex-direction-row is-justify-content-space-around">
          <button onClick={handleAcceptandCloseModal} className="button is-primary">{modalData.confirmBtnText}</button>
          <button onClick={handleCloseModal} className="button is-danger">{modalData.declineBtnText}</button>
        </div>
      </div>
      <button onClick={handleCloseModal} className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

export default ActionModal