import { MongoClientOptions } from 'mongodb';

declare global {
  interface MongoOptions extends MongoClientOptions
  {
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean,
  }
}