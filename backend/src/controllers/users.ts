import { Document, ObjectId } from 'mongodb';
import { client } from '../database';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'

export async function createUser(newUser: Document) {
  try {
    await client.db(dbName).collection('users').insertOne(newUser)
  } catch (error) {
    return null
  }
}

export async function deleteUserById(id: string) {
  const result = await client.db(dbName).collection('users').findOneAndDelete({_id: new ObjectId(id)})

  // Return user object that was deleted
  return result.value
}

export async function getUserByUsername(username: string) {
  const result = await client.db(dbName).collection('users').findOne({username})

  return result
}

export async function getAllUsers() {
  const result = await client.db(dbName).collection('users').find().toArray()

  return result
}