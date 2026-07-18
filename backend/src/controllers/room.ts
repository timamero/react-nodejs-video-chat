/**
 * Functions set, update, and delete room data in redis database
 */
import { randomUUID } from 'crypto';

import { client } from '../database';
import { Room, User } from '../util/types';
import { setUserStatus, getAllUsers } from './users';

const ROOM_PREFIX = process.env.NODE_ENV === 'test' ? 'test:room' : 'dev:room';
const USER_PREFIX = process.env.NODE_ENV === 'test' ? 'test:user' : 'dev:user';
const ROOMT_SET = `${ROOM_PREFIX}:room_ids`;

/**
 * Create new room key and add to room set in redis database
 * @returns {string} The id of the new room
 * @returns {null} For testing, returns null when there is an error
 */
export async function createRoom() {
  try {
    const id = randomUUID();
    const roomKey = `${ROOM_PREFIX}:${id}`;

    const roomData = {
      id,
      users: JSON.stringify([]), // Store users as a JSON string
    };

    // Store the room object in Redis as a hash
    await client.hSet(roomKey, roomData);

    // Add the ID to our set of active rooms so we can query them later
    await client.sAdd(ROOMT_SET, id);

    return roomData.id;
  } catch (error) {
    console.error('Redis createRoom error: ', error);
    return null;
  }
}

/**
 * Update room value in redis database by adding user to room
 * @param {string} roomId - The room id
 * @param {string} socketId - The user's socketId to be added to room
 */
export async function addUserBySocketId(roomId: string, socketId: string) {
  try {
    let user: User;
    const room = await getRoom(roomId);
    if (!room) {
      console.error(`Room with id ${roomId} not found`);
      return;
    }

    // Find the user by socketId
    const allUsers = await getAllUsers();
    if (!allUsers) {
      console.warn('No users found in the active set.');
      return;
    }
    user = allUsers.find((u) => u.socketId === socketId)!;

    if (!user) {
      console.error(`User with socketId ${socketId} not found`);
      return;
    }

    // Update the room's users array
    const updatedUsers = JSON.parse(room.users);
    updatedUsers.push(user.id);
    room.users = JSON.stringify(updatedUsers);

    // Update the room in Redis
    await client.hSet(`${ROOM_PREFIX}:${roomId}`, 'users', room.users);

    // Set the user's isBusy status to true
    await setUserStatus(user.id, 'true');
  } catch (error) {
    console.error('Redis addUserBySocketId error: ', error);
  }
}

/**
 * Get the room object by room id
 * @param {string} roomId - The room id
 * @returns {Room} The room object
 */
export async function getRoom(roomId: string) {
  try {
    let room: Room;
    const rawRoom = await client.hGetAll(`${ROOM_PREFIX}:${roomId}`);
    if (!rawRoom || Object.keys(rawRoom).length === 0) {
      console.error(`Room with id ${roomId} not found`);
      return;
    } else {
      room = {
        id: rawRoom.id,
        users: rawRoom.users,
      };
    }

    return room;
  } catch (error) {
    console.error('Redis getRoom error: ', error);
  }
}

/**
 * Get the list of socket ids of the users in the room
 * @param {string} roomId - The room id
 * @returns {string[]} The list of socket ids
 */
export async function getRoomUsersSocketId(roomId: string) {
  try {
    const room = await getRoom(roomId);
    if (!room) {
      console.error(`Room with id ${roomId} not found`);
      return;
    }

    const allUsers = await getAllUsers();
    if (!allUsers) {
      console.warn('No users found in the active set.');
      return;
    }

    const socketIds = JSON.parse(room.users)
      .map((userId: string) => {
        const user = allUsers.find((u) => u.id === userId);
        return user ? user.socketId : null;
      })
      .filter((socketId: string | null) => socketId !== null);

    return socketIds;
  } catch (error) {
    console.error('Redis getRoomUsersSocketId error: ', error);
  }
}

/**
 * Delete room object by room id and set the isBusy field in user doc to false
 * @param {string} roomId - The room id
 * @returns {Room} The room object that was deleted
 */
export async function deleteRoomById(roomId: string) {
  try {
    const room = await getRoom(roomId);
    if (!room) {
      console.error(`Room with id ${roomId} not found`);
      return;
    }

    const roomKey = `${ROOM_PREFIX}:${roomId}`;

    // Remove the room from the room set
    await client.sRem(ROOMT_SET, roomId);
    // Delete the room hash
    await client.del(roomKey);

    // Set the isBusy field in user docs to false
    const allUsers = await getAllUsers();
    if (!allUsers) {
      console.warn('No users found in the active set.');
      return;
    }

    const userIds = JSON.parse(room.users);
    for (const userId of userIds) {
      const user = allUsers.find((u) => u.id === userId);
      if (user) {
        await setUserStatus(user.id, 'false');
      }
    }

    return room;
  } catch (error) {
    console.error(error);
  }
}
