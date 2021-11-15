import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import activeUsersReducer from './features/activeUsersSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeUsers: activeUsersReducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch