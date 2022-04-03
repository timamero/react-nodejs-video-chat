import { MongoClient } from 'mongodb';

let uri;
if (process.env.NODE_ENV === 'production') {
  console.log('production: uri', process.env.MONGODB_URI_PROD);
  uri = process.env.MONGODB_URI_PROD;
} else {
  console.log('not production', process.env.NODE_ENV);
  uri = process.env.MONGODB_URI;
}
// const uri = process.env.MONGODB_URI;

/*
 * Create the mongodb client
*/
export let client: MongoClient;
if (process.env.NODE_ENV === 'test') {
  const globalURI = global as typeof globalThis & {
    __MONGO_URI__: string;
  };

  const options: MongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  };

  client= new MongoClient(globalURI.__MONGO_URI__, options);
} else {
  client = new MongoClient(uri);
}

/**
 * Connect mongodb client
 */
const main = async () => {
  try {
    await client.connect();

    // clean database everytime the server restarts
    await client.db('chat').collection('users').deleteMany({});
    await client.db('chat').collection('room').deleteMany({});

    console.log('Connected to MongoDB');
  } catch(e) {
    console.log(e);
  }
};

export default main;