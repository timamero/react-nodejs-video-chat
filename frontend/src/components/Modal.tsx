import React from 'react';

interface ModalProps {
  modalContent: string;
  confirmBtnText: string;
  declineBtnText: string;
  isActive: boolean;
}

const Modal: React.FC<ModalProps> = ({ modalContent, confirmBtnText, declineBtnText, isActive }) => {
  return (
    <div className={`modal ${isActive && 'is-active'}`}>
      <div className="modal-background"></div>
      <div className="modal-content box">
        <p className="has-text-centered is-size-4 my-2">{modalContent}</p>
        <div className="is-flex is-flex-direction-row is-justify-content-space-around">
          <button className="button is-primary">{confirmBtnText}</button>
          <button className="button is-danger">{declineBtnText}</button>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  )
}

export default Modal