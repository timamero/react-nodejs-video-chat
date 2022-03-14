/**
 * Functions to request data from room collection
 */
import { client } from '../database'

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'
const collectionName = 'room'

export async function createRoom() {
  try {
    await client.db(dbName).collection(collectionName).insertOne({ users: []})
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addUserBySocketId(socketId: string) {
  return null
}