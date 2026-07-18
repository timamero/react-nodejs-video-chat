import { Server, Socket } from 'socket.io';
import {
  createRoom,
  addUserBySocketId,
  getRoomUsersSocketId,
  getRoom,
  deleteRoomById,
} from '../controllers/room';
import { getUserById } from '../controllers/users';

/**
 * Socket event listener functions for sending and receiving
 * invites to a private chat, creating and closing the private
 * chat room, and for establishing the RTCPeerConnection
 * @param {Socket} socket
 * @param {Server} io
 */
const privateChat = async (socket: Socket, io: Server) => {
  socket.on('invite private chat', (inviteeId) => {
    console.log(`${socket.id} invited ${inviteeId} to a chat`);

    // Send invite request with inviter id to invitee
    io.to(inviteeId).emit('invite requested', socket.id);
  });

  socket.on('invite accepted', async (inviterId) => {
    console.log(`${socket.id} accepted chat with ${inviterId}`);

    try {
      // ERROR IS THROWN HERE
      const roomId = await createRoom();
      if (!roomId) {
        throw new Error('Failed to create room');
      }
      console.log('DEBUG: privateChat roomId', roomId);
      console.log('DEBUG: privateChat inviterId', inviterId);
      await addUserBySocketId(roomId, inviterId);
      console.log('DEBUG: privateChat socket.id', socket.id);
      await addUserBySocketId(roomId, socket.id);
      const socketIds = await getRoomUsersSocketId(roomId);
      console.log('DEBUG: privateChat socketIds', socketIds);
      if (socketIds?.length !== 2) {
        throw new Error('Room does not have exactly 2 users');
      }
      const roomData = {
        roomId: roomId,
        users: socketIds,
      };
      console.log('DEBUG: privateChat roomData', roomData);

      console.log('DEBUG: calling io.in() with ', socketIds[0]);
      console.log('DEBUG: calling .socketsJoin() with ', roomId.toString());
      io.in(socketIds[0]).socketsJoin(roomId);
      console.log('DEBUG: calling io.in() with ', socketIds[1]);
      io.in(socketIds[1]).socketsJoin(roomId);
      io.to(roomId).emit('enter chat room', roomData);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('decline invite', (inviterId) => {
    console.log(`${socket.id} declined chat with ${inviterId}`);

    io.to(inviterId).emit('invite declined', socket.id);
  });

  socket.on('send chat message', (sentMessageData) => {
    const messageData = {
      msg: sentMessageData.msg,
      userId: socket.id,
    };

    io.to(sentMessageData.roomId).emit('receive chat message', messageData);
    console.log('message: ' + messageData.msg);
  });

  socket.on('video request accepted', async (roomId) => {
    try {
      const room = await getRoom(roomId);
      // The first user in the users array will initialize the RTCPeerConnection
      const user = await getUserById(room!.users[0]);
      const userSocketId = user!.socketId;
      console.log('send video ready to ', userSocketId);
      io.to(userSocketId).emit('video ready');
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('video offer', async ({ sdp, roomId }) => {
    try {
      const room = await getRoom(roomId);
      // The second user in the users array will receice `get video offer` event
      const user = await getUserById(room!.users[1]);
      const userSocketId = user!.socketId;
      console.log(`send get video offer to ${userSocketId}`);

      io.to(userSocketId).emit('get video offer', sdp);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('video answer', async ({ sdp, roomId }) => {
    try {
      const room = await getRoom(roomId);
      const user = await getUserById(room!.users[0]);
      const userSocketId = user!.socketId;
      console.log(`answer - send get video answer to ${userSocketId}`);

      io.to(userSocketId).emit('get video answer', sdp);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('candidate', async ({ candidate, roomId }) => {
    try {
      const room = await getRoom(roomId);
      if (!room) {
        console.error(`Room with id ${roomId} not found`);
        return;
      }

      if (room.users.length !== 2) {
        console.error(`Room with id ${roomId} does not have exactly 2 users`);
        return;
      }
      console.log(`ice candidate from ${socket.id}`);

      const user1 = await getUserById(room!.users[0]);
      const user2 = await getUserById(room!.users[1]);
      const user1SocketId = user1!.socketId;
      const user2SocketId = user2!.socketId;

      if (socket.id === user1SocketId) {
        console.log(`send get candidate to ${user2SocketId}`);
        io.to(user2SocketId).emit('get candidate', candidate);
      } else {
        console.log(`send get candidate to ${user1SocketId}`);
        io.to(user1SocketId).emit('get candidate', candidate);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('end chat', async (roomId) => {
    console.log('DEGUG: end chat for room', roomId);
    try {
      const room = await getRoom(roomId);
      if (!room) {
        console.error(`Room with id ${roomId} not found`);
        return;
      }
      console.log(`end chat for room ${roomId}`);

      const user1 = await getUserById(room.users[0]);
      const user2 = await getUserById(room.users[1]);
      if (
        user1 === null ||
        user2 === null ||
        user1 === undefined ||
        user2 === undefined
      ) {
        console.error(`One or both users in room ${roomId} not found`);
        return;
      }
      const user1SocketId = user1.socketId;
      const user2SocketId = user2.socketId;

      await deleteRoomById(roomId);

      io.to(user1SocketId).emit('end video request');
      io.to(user2SocketId).emit('end video request');
      io.to(roomId).emit('close chat room');
    } catch (error) {
      console.error(error);
    }
  });
};

export default privateChat;
