import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import activeUsersReducer from './activeUsersSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    activeUsers: activeUsersReducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch