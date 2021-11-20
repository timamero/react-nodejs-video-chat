import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from './types'
interface ActiveUsersState {
  users: User[];
}

const initialState: ActiveUsersState = {
  users: [],
}

export const activeUsersSlice = createSlice({
  name: 'activeUsers',
  initialState,
  reducers: {
    getAllActiveUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    }
  }
})

export const { getAllActiveUsers } = activeUsersSlice.actions

export default activeUsersSlice.reducer