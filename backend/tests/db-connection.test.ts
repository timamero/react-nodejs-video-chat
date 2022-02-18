import { MongoClient, Db, ObjectId } from 'mongodb';

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

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
    // await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-id')

    const mockUser = { _id: id, name: 'Jane'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);
  });
});