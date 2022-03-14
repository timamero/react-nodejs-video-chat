/**
 * Functions to request data from room collection
 */
import { ObjectId } from 'mongodb'
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

export async function addUserBySocketId(roomId: ObjectId, socketId: string) {
  console.log('addUser...roomId', roomId)
  console.log('addUser...socketId', socketId)
  try {
    const roomFilter = {
      _id: roomId
    }

    const user = await client.db(dbName).collection('users').findOne({ socket: socketId })
    const room = await client.db(dbName).collection(collectionName).findOne(roomFilter)

    const update = {
      $set: { 'users' : room?.users.concat(user?._id) }
    }

    await client.db(dbName).collection(collectionName).findOneAndUpdate(roomFilter, update)
  } catch (error) {
    console.error(error)
  }
}