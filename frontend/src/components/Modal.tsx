import React, { useContext } from 'react';
import { resetModal } from '../app/features/modalSlice';
import { Modal } from '../app/features/types'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { SocketContext } from '../context/socket';

const ActionModal: React.FC = () => {
  const socket = useContext(SocketContext)
  const dispatch = useAppDispatch();
  const modalData = useAppSelector<Modal>(state => state.modal);

  const handleCloseModal = () => {
    dispatch(resetModal())
  }

  const handleAcceptandCloseModal = () => {
    // Send server event when user invites another user to a private chat
    socket.emit(modalData.socketEvent, modalData.inviteeId)
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