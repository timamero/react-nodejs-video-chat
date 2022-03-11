import { Db } from 'mongodb';
import { client } from '../../src/database';

/**
 * Test room controller methods
 */
describe('Controllers - users', () => {
  let db: Db;

  beforeAll(async () => {
    await client.connect()
    db = await client.db();
  });

  beforeEach(async () => {
    await db.collection('room').deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });

  it('createRoom function should insert a doc into collection', async () => {
    const room = db.collection('room');
    const expectedRoom = { users: [] }
    
    await createRoom();

    const insertedRoom = await room.find().toArray();
    expect(insertedRoom).toHaveLength(1)
    expect(insertedRoom[0]).toEqual(expectedRoom);
  });
});