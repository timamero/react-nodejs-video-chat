/**
 * Socket instance connection
 */
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

let base = 'ws://localhost:';
let port = '8000';

if (process.env.NODE_ENV === 'production') {
  base = process.env.REACT_APP_BASE_URL!;
  port= '';
}
export const socket: Socket = io(`${base}${port}`);
socket.connect();

export const SocketContext = createContext(socket);