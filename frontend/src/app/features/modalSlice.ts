import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modal } from './types'

const initialState: Modal = {
  modalContent: '',
  confirmBtnText: '',
  declineBtnText: '',
  isActive: false
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
    },
    resetModal: (state, action: PayloadAction<Modal>) => {
      state = action.payload
    }
  }
})

export const { setModal, resetModal } = modalSlice.actions

export default modalSlice.reducer