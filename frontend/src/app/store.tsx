import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import activeUsersReducer from './features/activeUsersSlice';
import modalSlice from './features/modalSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeUsers: activeUsersReducer,
    modal: modalSlice
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch