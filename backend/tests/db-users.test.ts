import { MongoClient, Db, ObjectId } from 'mongodb';
import { createUser, deleteUser, getUserByUsername } from '../src/controllers/users'

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
  });

  it('createUser function should insert a doc into collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-01')
    const username = 'Jane01'
    
    const mockUser = { _id: id, username};
    await createUser(connection, mockUser);

    const insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);
  });

  it('deleteUser function should delete a doc from collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-02')
    const username = 'Jane02'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    let insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(mockUser);

    const result = await deleteUser(connection, username);
    expect(result).toEqual(mockUser)

    insertedUser = await users.findOne({ _id: id});
    expect(insertedUser).toEqual(null);
  });

  it('deleteUser function should return null if username not found in collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-02')
    const username = 'Jane02'
    const usernameNotInCollection = 'Nora'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await deleteUser(connection, usernameNotInCollection);
    expect(result).toEqual(null)
  });

  it.only('getUserByUsername function should get correct user from collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-03')
    const username = 'Jane03'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(connection, username)
    expect(result).toEqual(mockUser)
  });

  it.only('getUserByUsername function should return null if username is not found in collection', async () => {
    const users = db.collection('users');
    const id = new ObjectId('some-user-03')
    const username = 'Jane03'
    const usernameNotInCollection = 'Nora'
    
    const mockUser = { _id: id, username};
    await users.insertOne(mockUser);

    const result = await getUserByUsername(connection, usernameNotInCollection)
    expect(result).toEqual(null)
  });
});