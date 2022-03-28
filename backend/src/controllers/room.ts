/**
 * Functions to request data from room collection
 */
import { ObjectId } from 'mongodb'
import { client } from '../database'
import { setUserStatus } from './users'

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

    // set the isBusy field in user doc to true when user is added to a room
    await setUserStatus(user!._id, true)
  } catch (error) {
    console.error(error)
  }
}

export async function getRoom(roomId: string) {
  try {
    const id = new ObjectId(roomId)
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: id })
    return room
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

export async function deleteRoomById(roomId: string) {
  try {
    const id = new ObjectId(roomId)

    // set the isBusy field in user doc to false when user is added to a room
    const room = await client.db(dbName).collection(collectionName).findOne({ _id: id })
    const user1 = await client.db(dbName).collection('users').findOne({_id: room!.users[0]})
    const user2 = await client.db(dbName).collection('users').findOne({_id: room!.users[1]})
    await setUserStatus(user1!._id, false)
    await setUserStatus(user2!._id, false)
    
    const result = await client.db(dbName).collection(collectionName).findOneAndDelete({_id: id})
    
    // For testing, return room object that was deleted
    return result.value
  } catch (error) {
    console.error(error)
  }
}