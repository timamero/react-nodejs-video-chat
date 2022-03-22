/**
 * Functions to request data from room collection
 */
import { ObjectId } from 'mongodb'
import { User } from '../../util/types'
import { client } from '../database'

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'
const collectionName = 'room'

export async function createRoom() {
  // Return the room id after room is created
  try {
    const result = await client.db(dbName).collection(collectionName).insertOne({ users: []})
    return result.insertedId
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addUserBySocketId(roomId: ObjectId, socketId: string) {
  try {
    const roomFilter = {
      _id: roomId
    }

    const user = await client.db(dbName).collection('users').findOne({ socketId })
    const room = await client.db(dbName).collection(collectionName).findOne(roomFilter)

    const update = {
      $set: { 'users' : room?.users.concat(user?._id) }
    }

    await client.db(dbName).collection(collectionName).findOneAndUpdate(roomFilter, update)
  } catch (error) {
    console.error(error)
  }
}

export async function getRoomUsersSocketId(roomId: ObjectId) {
  try {
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: roomId })

    const user1 = await client.db(dbName).collection('users').findOne({_id: room!.users[0]})
    const user2 = await client.db(dbName).collection('users').findOne({_id: room!.users[1]})

    return [user1!.socketId, user2!.socketId]
  } catch (error) {
    console.error(error)
  }
}

export async function deleteRoomById(roomId: ObjectId) {
  try {
    const result = await client.db(dbName).collection(collectionName).findOneAndDelete({_id: roomId})
    // For testing, return room object that was deleted
    return result.value
  } catch (error) {
    console.error(error)
  }
}