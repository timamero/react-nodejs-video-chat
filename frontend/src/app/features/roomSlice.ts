import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Message } from './types'

const initialState: Room = {
  roomId: '',
  users: [],
  isChatVisible: false,
  messages: [],
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
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.concat(action.payload)
    },
    resetRoom: (state) => {
      state.roomId = ''
      state.users = []
      state.messages = []
    }
  }
})

export const { setRoom, resetRoom, setChatVisbility, addMessage } = roomSlice.actions

export default roomSlice.reducer