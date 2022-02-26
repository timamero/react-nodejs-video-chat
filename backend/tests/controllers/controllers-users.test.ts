import { Db, ObjectId } from 'mongodb';
import { client } from '../../src/database';
import { createUser, deleteUserById, getAllUsers, getUserByUsername } from '../../src/controllers/users'

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
    const id = new ObjectId('some-user-01')
    const username = 'Jane01'
    
    const mockUser = { _id: id, username};
    await createUser(mockUser);

    const insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);
  });

  it('if socketId already exists in database, createUser function should return null', async () => {
    const users = db.collection('users');
    let id = new ObjectId('some-user-01')
    let username = 'Jane01'
    
    const mockUser = { _id: id, username};
    await createUser(mockUser);

    const insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);

    id = new ObjectId('some-user-01')
    username = 'Jane02'
    const mockUserWithSameId = { _id: id, username};
    const result = await createUser(mockUserWithSameId)
    expect(result).toBeNull()
  });

  it('deleteUser function should delete a doc from collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-02')
    const username = 'Jane02'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    let insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);

    const result = await deleteUserById(id.toString());
    expect(result).toEqual(mockUser)

    insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(null);
  });

  it('deleteUser function should return null if username not found in collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-02')
    const username = 'Jane02'
    const userIdNotInCollection = new ObjectId('some-user-03')
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await deleteUserById(userIdNotInCollection.toString());
    expect(result).toEqual(null)
  });

  it('getUserByUsername function should get correct user from collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-03')
    const username = 'Jane03'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(username)
    expect(result).toEqual(mockUser)
  });

  it('getUserByUsername function should return null if username is not found in collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-03')
    const username = 'Jane03'
    const usernameNotInCollection = 'Nora'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(usernameNotInCollection)
    expect(result).toEqual(null)
  });

  it('getAllUsers function should return list of all users from collection', async () => {
    const users = db.collection('users');

    const userObjects = [
      {
        _id: new ObjectId('some-user-01'),
        username: 'Jane01'
      },
      {
        _id: new ObjectId('some-user-02'),
        username: 'Jane02'
      },
      {
        _id: new ObjectId('some-user-03'),
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