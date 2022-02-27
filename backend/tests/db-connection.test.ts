import { Db, ObjectId } from 'mongodb';
import { client } from '../src/database';

/**
 * Test connection to test database
 */
describe('Connection', () => {
  let db: Db;

  beforeAll(async () => {
    await client.connect()
    db = await client.db();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await client.close();
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