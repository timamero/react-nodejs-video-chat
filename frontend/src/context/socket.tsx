/**
 * Socket instance connection
 */
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socketUrl = 'http://localhost:3001';

export const socket: Socket = io(socketUrl, { path: '/socket.io' });
// socket.connect();

export const SocketContext = createContext(socket);