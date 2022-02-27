import { Document, ObjectId } from 'mongodb';
import { client } from '../database';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'

export async function createUser(newUser: Document) {
  try {
    await client.db(dbName).collection('users').insertOne(newUser)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteUserBySocketId(socketId: string) {
  try {
    const result = await client.db(dbName).collection('users').findOneAndDelete({socketId})
    // Return user object that was deleted
    return result.value
  } catch (error) {
    console.error(error)
  }
}

export async function getUserByUsername(username: string) {
  try {
    const result = await client.db(dbName).collection('users').findOne({username})
    return result
  } catch (error) {
    console.error(error)
  }
}

export async function getAllUsers() {
  try {
    const result = await client.db(dbName).collection('users').find().toArray()
    return result
  } catch (error) {
    console.error(error)
  }
}