/**
 * This file is responsible for creating a redis client and connecting to the redis server
 * References:
 * - https://redis.io/docs/latest/develop/clients/nodejs/
 * - https://redis.js.org/#node-redis
 */
import { createClient } from 'redis';

let url: string;
if (process.env.NODE_ENV === 'production') {
  console.log('production: redis url', process.env.REDIS_URI_PROD);
  url = process.env.REDIS_URI_PROD || 'redis://localhost:6379';
} else {
  console.log('not production', process.env.NODE_ENV);
  url = process.env.REDIS_URL || 'redis://localhost:6379';
}

/*
 * Create the redis client and connect to the redis server
 */
export const client = createClient({
  url,
});

client.on('error', (err) => console.log('Redis Client Error', err));

/**
 * Connect to the redis server and clean the database on server restart
 */
const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');

    // clean database everytime the server restarts
    await client.flushDb();
    console.log('Redis database cleaned');
  } catch (e) {
    console.error('Failed to connect to Redis', e);
  }
};

export default connectRedis;
