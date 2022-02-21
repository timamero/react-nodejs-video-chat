import { Document, MongoClient } from 'mongodb';

const dbName = process.env.NODE_ENV === 'test' ? 'test' : 'chat'

export async function createUser(client: MongoClient, newUser: Document) {
  const result = await client.db(dbName).collection('users').insertOne(newUser)

  // console.log(`New user created with the following id: ${result.insertedId}`)
}

export async function deleteUser(client: MongoClient, username: string) {
  const result = await client.db(dbName).collection('users').findOneAndDelete({username})
  
  // Return user object that was deleted
  return result.value
}

export async function getUserByUsername(client: MongoClient, username: string) {
  const result = await client.db(dbName).collection('users').findOne({username})

  return result
}

export async function getAllUsers(client: MongoClient,) {
  const result = await client.db('chat').collection('users').find().toArray()

  console.log('result', result)
}