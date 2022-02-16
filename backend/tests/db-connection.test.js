// https://github.com/shelfio/jest-mongodb
const {MongoClient} = require('mongodb');

describe('Connection', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
    // await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = { _id: 'some-user-id', name: 'Jane'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});