import { Document, MongoClient } from 'mongodb';
import { client } from '../database';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'

export async function createUser(newUser: Document) {
  console.log('create user')
  try {
    await client.db(dbName).collection('users').insertOne(newUser)
  } catch (error) {
    return null
  }
}

export async function deleteUser(username: string) {
  const result = await client.db(dbName).collection('users').findOneAndDelete({username})
  
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