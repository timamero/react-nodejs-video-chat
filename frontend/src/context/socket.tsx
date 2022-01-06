import { createContext } from 'react';
import { io, Socket } from "socket.io-client";

// Create Socket instance and make it globally available
export const socket: Socket = io("ws://localhost:3001");
socket.connect()
export const SocketContext = createContext(socket);