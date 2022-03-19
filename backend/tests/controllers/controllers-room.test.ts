import { Db } from 'mongodb';
import { client } from '../../src/database'
import { createRoom, addUserBySocketId, deleteRoomById } from '../../src/controllers/room'

/**
 * Test room controller methods
 */
describe('Controllers - room', () => {
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

    await createRoom();
    const insertedRoom = await room.find().toArray()

    expect(insertedRoom).toHaveLength(1)
    expect(insertedRoom[0]).toEqual(
      expect.objectContaining(expectedRoom)
    );
  });

  it('addUserBySocketId function should add reference of user from users collection to a room collection\'s users array field', async () => {
    const users = db.collection('users');
    const room = db.collection('room')
    const mockRoom = { users: [] }
    const socketId = 'b1_UnFDfzUoU3yUeAAAB'

    const user = await users.findOne({ socket: socketId })
    const result = await room.insertOne(mockRoom)
    await addUserBySocketId(result.insertedId, socketId)
    const insertedRoom = await room.findOne({_id: result.insertedId})

    expect(insertedRoom).toBeDefined();
    expect(insertedRoom?.users).toHaveLength(1)
    expect(insertedRoom?.users).toContainEqual(user?._id)
  })

  it.only('deleteRoomById function should delete a doc from collection', async () => {
    const room = db.collection('room')
    const mockRoom = { users: [] }

    const result = await room.insertOne(mockRoom)
    const roomBeforeDelete = await room.find().toArray()
    expect(roomBeforeDelete).toHaveLength(1)

    const roomId = result.insertedId
    const deletedRoom = await deleteRoomById(roomId)
    expect(deletedRoom).toEqual(mockRoom)

    const roomAfterDelete = await room.find().toArray()
    expect(roomAfterDelete).toHaveLength(0)  
  });
});