import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import main from './database'

const app = express();
app.use(cors());

/*
 * Access variables in the .env file via process.env
*/
dotenv.config();


/*
 * Connect to MongoDB database
*/
main().catch(console.error)

export default app;