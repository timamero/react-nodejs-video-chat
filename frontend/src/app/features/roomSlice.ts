import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Room } from './types'

const initialState: Room = {
  roomId: '',
  users: [],
}

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.roomId = action.payload.roomId
      state.users = state.users.concat(action.payload.users)
    },
    resetRoom: (state) => {
      state.roomId = ''
      state.users = []
    }
  }
})

export const { setRoom, resetRoom } = roomSlice.actions

export default roomSlice.reducer