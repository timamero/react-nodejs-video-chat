import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from './types'

const initialState: Room = {
  roomId: '',
  users: [],
  isChatVisible: false
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.roomId = action.payload.roomId
      state.users = state.users.concat(action.payload.users)
    },
    setChatVisbility: (state, action: PayloadAction<boolean>) => {
      state.isChatVisible = action.payload
    },
    resetRoom: (state) => {
      state.roomId = ''
      state.users = []
    }
  }
})

export const { setRoom, resetRoom, setChatVisbility } = roomSlice.actions

export default roomSlice.reducer