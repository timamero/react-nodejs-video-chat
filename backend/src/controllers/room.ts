/**
 * Functions to request data from room collection
 */
import { ObjectId } from 'mongodb';
import { client } from '../database';
import { setUserStatus } from './users';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat';
const collectionName = 'room';

/**
 * Create new room document
 * @returns {ObjectId} The id of the created room
 */
export async function createRoom() {
  try {
    const result = await client.db(dbName).collection(collectionName).insertOne({ users: [] });
    return result.insertedId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Update room collection with users
 * @param {ObjectId} roomId - The room id
 * @param {string} socketId - The user's socketId to be added to room
 */
export async function addUserBySocketId(roomId: ObjectId, socketId: string) {
  try {
    const roomFilter = {
      _id: roomId
    };

    const user = await client.db(dbName).collection('users').findOne({ socketId });
    const room = await client.db(dbName).collection(collectionName).findOne(roomFilter);

    const update = {
      $set: { 'users' : room?.users.concat(user?._id) }
    };

    await client.db(dbName).collection(collectionName).findOneAndUpdate(roomFilter, update);

    // set the isBusy field in user doc to true when user is added to a room
    await setUserStatus(user!._id, true);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get the room document
 * @param {string} roomId - The room id
 * @returns {Room} The room object
 */
export async function getRoom(roomId: string) {
  try {
    const id = new ObjectId(roomId);
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: id });
    return room;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get the list of socket ids of the users in the room
 * @param {ObjectId} roomId - The room id
 * @returns {string[]} The list of socket ids
 */
export async function getRoomUsersSocketId(roomId: ObjectId) {
  try {
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: roomId });

    const user1 = await client.db(dbName).collection('users').findOne({ _id: room!.users[0] });
    const user2 = await client.db(dbName).collection('users').findOne({ _id: room!.users[1] });

    return [user1!.socketId, user2!.socketId];
  } catch (error) {
    console.error(error);
  }
}

/**
 * Delete room document and update user status field
 * @param {string} roomId - The room id
 * @returns {Room} The room object that was deleted is returned for testing purposes
 */
export async function deleteRoomById(roomId: string) {
  try {
    const id = new ObjectId(roomId);

    // set the isBusy field in user doc to false when user is added to a room
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: id });
    const user1 = await client.db(dbName).collection('users').findOne({ _id: room!.users[0] });
    const user2 = await client.db(dbName).collection('users').findOne({ _id: room!.users[1] });
    await setUserStatus(user1!._id, false);
    await setUserStatus(user2!._id, false);

    const result = await client.db(dbName).collection(collectionName).findOneAndDelete({ _id: id });

    return result.value;
  } catch (error) {
    console.error(error);
  }
}