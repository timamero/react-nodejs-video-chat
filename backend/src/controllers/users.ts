/**
 * Functions to request data from user collection
 */
import { Document, ObjectId } from 'mongodb';
import { client } from '../database';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat';

/**
 * Create new user document
 * @param {User} newUser - The new user object to be added
 * @returns {null} For testing, returns null when there is an error
 */
export async function createUser(newUser: Document) {
  try {
    await client.db(dbName).collection('users').insertOne(newUser);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Update `isBusy` field in user document
 * @param {ObjectId} id - The user id
 * @param {boolean} status - The status of the user
 */
export async function setUserStatus(id: ObjectId, status: boolean) {
  try {
    const update = {
      $set: { 'isBusy' : status }
    };
    await client.db(dbName).collection('users').findOneAndUpdate(
      { _id: id },
      update
    );
  } catch (error) {
    console.error(error);
  }
}

/**
 * Delete user document
 * @param {string} socketId - The user's socket id
 * @returns {User} The user object is returned for testing purposes
 */
export async function deleteUserBySocketId(socketId: string) {
  try {
    const result = await client.db(dbName).collection('users').findOneAndDelete({ socketId });
    return result.value;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get user document by id
 * @param {ObjectId} id - The user id
 * @returns {User} The user object
 */
export async function getUserById(id: ObjectId) {
  try {
    const result = await client.db(dbName).collection('users').findOne({ _id: id });
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get all users
 * @returns {Users[]} The list of all users
 */
export async function getAllUsers() {
  try {
    const result = await client.db(dbName).collection('users').find().toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
}