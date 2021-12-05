import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import activeUsersReducer from './features/activeUsersSlice';
import modalSlice from './features/modalSlice';
import notificationSlice from './features/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeUsers: activeUsersReducer,
    modal: modalSlice,
    notification: notificationSlice
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch