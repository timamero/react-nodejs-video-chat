/**
 * Socket instance connection
 */
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socketUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

export const socket: Socket = io(socketUrl, { path: '/socket.io' });

export const SocketContext = createContext(socket);
