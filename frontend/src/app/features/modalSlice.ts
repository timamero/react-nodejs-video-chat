import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modal } from './types'

const initialState: Modal = {
  modalContent: '',
  confirmBtnText: '',
  declineBtnText: '',
  isActive: false,
  inviteeId: '',
  socketEvent: ''
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<Modal>) => {
      state.modalContent = action.payload.modalContent;
      state.confirmBtnText = action.payload.confirmBtnText;
      state.declineBtnText = action.payload.declineBtnText;
      state.isActive = action.payload.isActive;
      state.inviteeId = action.payload.inviteeId;
      state.socketEvent = action.payload.socketEvent;
    },
    resetModal: (state) => {
      state.modalContent = '';
      state.confirmBtnText = '';
      state.declineBtnText = '';
      state.isActive = false;
      state.inviteeId = '';
      state.socketEvent = '';
    }
  }
})

export const { setModal, resetModal } = modalSlice.actions

export default modalSlice.reducer