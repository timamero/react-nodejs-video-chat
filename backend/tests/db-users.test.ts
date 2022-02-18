import { MongoClient, Db, ObjectId } from 'mongodb';
import { createUser } from '../src/controllers/users'

describe('Connection', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    let globalURI = global as typeof globalThis & {
      __MONGO_URI__: string;
    }
    connection = await MongoClient.connect(globalURI.__MONGO_URI__);
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('createUser function should insert a doc into collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-id')
    
    const mockUser = { _id: id, name: 'Jane'};
    await createUser(connection, mockUser);

    const insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);
  });
});