import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from './types'

const initialState: User = {
  id: '',
  username: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNewUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    }
  }
})

export const { setNewUser, setId } = userSlice.actions

export default userSlice.reducer

export const selectUserId = createSelector((state: RootState) => state.user, user => user.id)