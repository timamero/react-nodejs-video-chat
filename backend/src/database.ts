import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI
export const client = new MongoClient(uri)

const main = async () => {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

  } catch(e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

export default main