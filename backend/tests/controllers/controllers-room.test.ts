import { Db } from 'mongodb';
import { client } from '../../src/database'
import { createRoom } from '../../src/controllers/room'

/**
 * Test room controller methods
 */
describe('Controllers - users', () => {
  let db: Db;

  beforeAll(async () => {
    try {
      await client.connect()
      db = await client.db()
      const users = db.collection('users');
      const mockUsers = [
        { socket: 'a1_UnFDfzUoU3yUeAAAB', username: 'Jane'},
        { socket: 'b1_UnFDfzUoU3yUeAAAB', username: 'Nora'},
        { socket: 'c1_UnFDfzUoU3yUeAAAB', username: 'Cara'},
      ];

      await users.insertOne(mockUsers[0])
      await users.insertOne(mockUsers[1])
      await users.insertOne(mockUsers[2])
    } catch (error) {
      console.error(error)
    }  
  });

  beforeEach(async () => {
    try {
      await db.collection('room').deleteMany({})
    } catch (error) {
      console.error(error)
    }
  });

  afterAll(async () => {
    try {
      await client.close();
    } catch (error) {
      console.error(error)
    }
  });

  it('createRoom function should insert a doc into collection', async () => {
    const room = db.collection('room')
    const expectedRoom = { users: [] }
    
    try {
      await createRoom();
      const insertedRoom = await room.find().toArray()

      expect(insertedRoom).toHaveLength(1)
      expect(insertedRoom[0]).toEqual(
        expect.objectContaining(expectedRoom)
      );
    } catch (error) {
      console.error(error)
    }
  });

  it('addUser function should add reference of user from users collection to a room collection\'s users array field', async () => {

  })
});