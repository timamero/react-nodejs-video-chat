import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modal } from './types'

const initialState: Modal = {
  modalName: '',
  modalContent: '',
  confirmBtnText: '',
  declineBtnText: '',
  isActive: false,
  peerId: null,
  socketEvent: ''
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<Modal>) => {
      state.modalName = action.payload.modalName;
      state.modalContent = action.payload.modalContent;
      state.confirmBtnText = action.payload.confirmBtnText;
      state.declineBtnText = action.payload.declineBtnText;
      state.isActive = action.payload.isActive;
      state.peerId = action.payload.peerId;
      state.socketEvent = action.payload.socketEvent;
    },
    resetModal: (state) => {
      state.modalName = '';
      state.modalContent = '';
      state.confirmBtnText = '';
      state.declineBtnText = '';
      state.isActive = false;
      state.peerId = null;
      state.socketEvent = '';
    }
  }
})

export const { setModal, resetModal } = modalSlice.actions

export default modalSlice.reducer