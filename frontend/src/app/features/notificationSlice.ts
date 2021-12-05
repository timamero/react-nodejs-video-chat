import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from './types'

const initialState: Notification = {
  notificationContent: '',
  notificationType: '',
  isLoading: false,
  isActive: false,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notificationContent = action.payload.notificationContent;
      state.notificationType = action.payload.notificationType;
      state.isLoading = action.payload.isLoading;
      state.isActive = action.payload.isActive;
    },
    resetNotification: (state) => {
      state.notificationContent = '';
      state.notificationType = '';
      state.isLoading = false;
      state.isActive = false;
    }
  }
})

export const { setNotification, resetNotification } = notificationSlice.actions

export default notificationSlice.reducer