import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveUsersState, User } from '../../util/types';

const initialState: ActiveUsersState = {
  users: [],
};

export const activeUsersSlice = createSlice({
  name: 'activeUsers',
  initialState,
  reducers: {
    getAllActiveUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    }
  }
});

export const { getAllActiveUsers } = activeUsersSlice.actions;

export default activeUsersSlice.reducer;