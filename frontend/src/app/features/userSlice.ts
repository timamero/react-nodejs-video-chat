import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from '../../util/types'

const initialState: User = {
  socketId: '',
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
      state.socketId = action.payload
    }
  }
})

export const { setNewUser, setId } = userSlice.actions

export default userSlice.reducer