import React from 'react';
import { Modal } from '../app/features/types'
import { useAppSelector } from '../app/hooks';

const ActionModal: React.FC = () => {
  const modalData = useAppSelector<Modal>(state => state.modal)
  return (
    <div className={`modal ${modalData.isActive && 'is-active'}`}>
      <div className="modal-background"></div>
      <div className="modal-content box">
        <p className="has-text-centered is-size-4 my-2">{modalData.modalContent}</p>
        <div className="is-flex is-flex-direction-row is-justify-content-space-around">
          <button className="button is-primary">{modalData.confirmBtnText}</button>
          <button className="button is-danger">{modalData.declineBtnText}</button>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

export default ActionModal