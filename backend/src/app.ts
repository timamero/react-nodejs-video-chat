import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectRedis from './database';

const app = express();
app.use(cors());

/*
 * Access variables in the .env file via process.env
 */
dotenv.config();

/*
 * Connect to redis database
 */
connectRedis();

export default app;
