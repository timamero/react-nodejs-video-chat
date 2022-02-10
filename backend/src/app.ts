import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());

/*
 * Access variables in the .env file via process.env
*/
dotenv.config();


/*
 * Connect to MongoDB database
*/
const uri = process.env.MONGODB_URI
export const client = new MongoClient(uri)
const main = async () => {
  try {
    await client.connect()

  } catch(e) {
    console.log(e)
  } finally {
    await client.close()
  }
}

main().catch(console.error)

export default app;