import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../util/types';

const initialState: User = {
  socketId: '',
  username: '',
  isBusy: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNewUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
    },
    setIsBusy: (state, action: PayloadAction<boolean>) => {
      state.isBusy = action.payload;
    },
    resetUser: (state) => {
      state.socketId =  '';
      state.username = '';
      state.isBusy = false;
    }
  }
});

export const { setNewUser, setId, setIsBusy, resetUser } = userSlice.actions;

export default userSlice.reducer;