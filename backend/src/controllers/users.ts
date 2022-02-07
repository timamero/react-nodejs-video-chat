import { Document, MongoClient } from 'mongodb';

export async function createUser(client: MongoClient, newUser: Document) {
  const result = await client.db('chat').collection('users').insertOne(newUser)

  console.log(`New user created with the following id: ${result.insertedId}`)
}