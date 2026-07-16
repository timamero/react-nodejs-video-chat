import { createClient } from 'redis';

let url: string;
if (process.env.NODE_ENV === 'production') {
  console.log('production: redis url', process.env.REDIS_URI_PROD);
  url = process.env.REDIS_URI_PROD || 'redis://localhost:6739';
} else {
  console.log('not production', process.env.NODE_ENV);
  url = process.env.REDIS_URL || 'redis://localhost:6739';
}

/*
 * Create the redis client and connect to the redis server
 */
export const client = createClient({
  url,
});

client.on('error', (err) => console.log('Redis Client Error', err));
// if (process.env.NODE_ENV === 'test') {
//   const globalURI = global as typeof globalThis & {
//     __MONGO_URI__: string;
//   };

//   const options: MongoOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     keepAlive: true,
//   };

//   client = new MongoClient(globalURI.__MONGO_URI__, options);
// } else {
//   client = new MongoClient(uri);
// }

/**
 * Connect to the redis server and clean the database on server restart
 */
const main = async () => {
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

export default main;
