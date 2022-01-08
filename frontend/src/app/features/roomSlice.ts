import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from './types'

const initialState: Room = {
  roomId: '',
  users: [],
  isVideoOn: false
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.roomId = action.payload.roomId
      state.users = state.users.concat(action.payload.users)
    },
    setVideoState: (state, action: PayloadAction<boolean>) => {
      state.isVideoOn = action.payload
    },
    resetRoom: (state) => {
      state.roomId = ''
      state.users = []
      state.isVideoOn = false
    }
  }
})

export const { setRoom, resetRoom, setVideoState } = roomSlice.actions

export default roomSlice.reducer