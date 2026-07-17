/**
 * Functions to set, update, and delete user data in redis database
 */
import { randomUUID } from 'crypto';

import { client } from '../database';
import { User } from '../util/types';

const PREFIX = process.env.NODE_ENV === 'test' ? 'test:user' : 'dev:user';
const ACTIVE_SET = `${PREFIX}:active_ids`;

/**
 * Create new user key and add to active set in redis database
 * @param {User} newUser - The new user object to be added
 * @returns {null} For testing, returns null when there is an error
 */
export async function createUser(newUser: Partial<User>) {
  try {
    const id = newUser.id || randomUUID();
    const userKey = `${PREFIX}:${id}`;
    console.log('Setting user with userKey: ', userKey);

    const userData = {
      id,
      socketId: newUser.socketId || '',
      username: newUser.username || '',
      isBusy: newUser.isBusy === 'false' ? 'false' : 'true',
    };
    console.log('userData: ', userData);

    // Store the user object in Redis as a hash
    await client.hSet(userKey, userData);

    // Add the ID to our set of active users so we can query them later
    await client.sAdd(ACTIVE_SET, id);

    return userData;
  } catch (error) {
    console.error('Redis createUser error: ', error);
    return null;
  }
}

/**
 * Update `isBusy` status of a user in redis database
 * @param {string} id - The user id
 * @param {boolean} status - The status of the user
 */
export async function setUserStatus(id: string, status: string) {
  try {
    const userKey = `${PREFIX}:${id}`;

    // Ensure the user exists before updating
    const exists = await client.exists(userKey);
    if (exists) {
      await client.hSet(
        userKey,
        'isBusy',
        status === 'true' ? 'true' : 'false',
      );
    }
  } catch (error) {
    console.error('Redis setUserStatus error:', error);
  }
}

/**
 * Delete user key and remove from active set in redis database
 * @param {string} socketId - The user's socket id
 * @returns {User} The user object is returned for testing purposes
 */
export async function deleteUserBySocketId(socketId: string) {
  try {
    const allUsers = await getAllUsers();
    if (!allUsers) {
      console.warn('No users found in the active set.');
      return null;
    }

    const userToDelete = allUsers.find((user) => user.socketId === socketId);

    if (userToDelete) {
      const userKey = `${PREFIX}:${userToDelete.id}`;

      // Remove the user from the active set
      await client.sRem(ACTIVE_SET, userToDelete.id);
      // Delete the user hash
      await client.del(userKey);

      return userToDelete;
    } else {
      console.warn(`User with socketId ${socketId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Redis deleteUserBySocketId error: ', error);
  }
}

/**
 * Get user hash by user id
 * @param {string} id - The user id
 * @returns {User} The user object
 */
export async function getUserById(id: string) {
  try {
    const userKey = `${PREFIX}:${id}`;
    const userData = await client.hGetAll(userKey);

    // If hash is empty, return null
    if (Object.keys(userData).length === 0) {
      return null;
    }

    // Convert isBusy from string to boolean
    userData.isBusy = String(userData.isBusy === 'true');

    return userData as User;
  } catch (error) {
    console.error('Redis getUserById error: ', error);
  }
}

/**
 * Get all users
 * @returns {Users[]} The list of all users
 */
export async function getAllUsers() {
  try {
    // Get all user IDs currently stored in the active set
    const ids = await client.sMembers(ACTIVE_SET);
    const users: User[] = [];

    // Retrieve the hash for each user ID and push it to the user array
    for (const id of ids) {
      const userData = await getUserById(id);
      if (userData) {
        users.push(userData);
      }
    }
    return users;
  } catch (error) {
    console.error('Redis getAllUsers error', error);
  }
}
