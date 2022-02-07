import { Document, MongoClient } from 'mongodb';

export async function createUser(client: MongoClient, newUser: Document) {
  const result = await client.db('chat').collection('users').insertOne(newUser)

  // console.log(`New user created with the following id: ${result.insertedId}`)
}

export async function getUserByUsername(client: MongoClient, username: string) {
  const result = await client.db('chat').collection('users').findOne({username})

  if (result) {
    console.log(`Found a user in the collection with the name ${username}`)
    console.log(result)
  } else {
    console.log(`No user found with the name ${username}`)
  }
}