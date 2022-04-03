import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDatabase from './database';

const app = express();
app.use(cors());

/*
 * Access variables in the .env file via process.env
*/
dotenv.config();


/*
 * Connect to MongoDB database
*/
connectDatabase().catch(console.error);

export default app;