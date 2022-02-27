import { Db } from 'mongodb';
import { client } from '../../src/database';
import { createUser, deleteUserBySocketId, getAllUsers, getUserByUsername } from '../../src/controllers/users'

/**
 * Test user controller methods
 */
describe('Controllers - users', () => {
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

  it('createUser function should insert a doc into collection', async () => {
    const users = db.collection('users');
    const socketId = 'a1_UnFDfzUoU3yUeAAAB'
    const username = 'Jane01'
    
    const mockUser = { socketId, username};
    await createUser(mockUser);

    const insertedUser = await users.findOne({ socketId });
    expect(insertedUser).toEqual(mockUser);
  });

  it('deleteUserBySocketId function should delete a doc from collection', async () => {
    const users = db.collection('users');
    const socketId = 'b1_UnFDfzUoU3yUeAAAB'
    const username = 'Jane02'
    
    const mockUser = { socketId, username};
    await users.insertOne(mockUser);

    let insertedUser = await users.findOne({ socketId });
    expect(insertedUser).toEqual(mockUser);

    const result = await deleteUserBySocketId(socketId);
    expect(result).toEqual(mockUser)

    insertedUser = await users.findOne({ socketId });
    expect(insertedUser).toEqual(null);
  });

  it('deleteUserBySocketId function should return null if socketId not found in collection', async () => {
    const users = db.collection('users');
    const socketId = 'c1_UnFDfzUoU3yUeAAAB'
    const username = 'Jane03'
    const socketIdNotInCollection = 'd1_UnFDfzUoU3yUeAAAB'
    
    const mockUser = { socketId, username};
    await users.insertOne(mockUser);

    const result = await deleteUserBySocketId(socketIdNotInCollection);
    expect(result).toEqual(null)
  });

  it('getUserByUsername function should get correct user from collection', async () => {
    const users = db.collection('users');
    const socketId = 'e1_UnFDfzUoU3yUeAAAB'
    const username = 'Jane04'
    
    const mockUser = { socketId, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(username)
    expect(result).toEqual(mockUser)
  });

  it('getUserByUsername function should return null if username is not found in collection', async () => {
    const users = db.collection('users');
    const socketId = 'f1_UnFDfzUoU3yUeAAAB'
    const username = 'Jane05'
    const usernameNotInCollection = 'Nora'
    
    const mockUser = { socketId, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(usernameNotInCollection)
    expect(result).toEqual(null)
  });

  it('getAllUsers function should return list of all users from collection', async () => {
    const users = db.collection('users');

    const userObjects = [
      {
        socketId: 'g1_UnFDfzUoU3yUeAAAB',
        username: 'Jane01'
      },
      {
        socketId: 'h1_UnFDfzUoU3yUeAAAB',
        username: 'Jane02'
      },
      {
        socketId: 'i1_UnFDfzUoU3yUeAAAB',
        username: 'Jane03'
      },
    ]
    
    userObjects.forEach(async (user) => {
      await users.insertOne(user);
    })
    

    const result = await getAllUsers()
    expect(result).toEqual(userObjects)
  });
});