import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ActiveUsersState {
  users: string[];
}

const initialState: ActiveUsersState = {
  users: [],
}

export const activeUsersSlice = createSlice({
  name: 'activeUsers',
  initialState,
  reducers: {
    getAllActiveUsers: (state, action: PayloadAction<string[]>) => {
      state.users = action.payload
    },
  }
})

export const { getAllActiveUsers } = activeUsersSlice.actions

export default activeUsersSlice.reducer