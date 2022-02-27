import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI

export let client: MongoClient
if (process.env.NODE_ENV === 'test') {
  let globalURI = global as typeof globalThis & {
    __MONGO_URI__: string;
  }
  client= new MongoClient(globalURI.__MONGO_URI__);
} else {
  client = new MongoClient(uri)
}

const main = async () => {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
  } catch(e) {
    console.log(e)
  } 
}

export default main