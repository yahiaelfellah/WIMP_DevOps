// db.test.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env' )});

const uri = process.env.MONGODB_URL || 'mongodb://root:example@localhost:27017/WIMPv2'; // your MongoDB URI
let client;

async function connect() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
  return client.db();
}

async function clearAllCollections() {
  if(client){
    const db = await client.db();
    const collectionNames = await db.listCollections().toArray();
    for (const { name } of collectionNames) {
      await db.collection(name).deleteMany({});
    }
  }

}

async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongoServer.getUri();
  await clearAllCollections ();

});

afterAll(async () => {
  await close();
  await mongoServer.stop();
});

describe('MongoDB connection', () => {
  test('connects to MongoDB', async () => {
    const db = await connect();
    await clearAllCollections();
    const collections = await db.listCollections().toArray();
    expect(Array.isArray(collections)).toBe(true);
  });
});

module.exports = {
  connect,
  clearAllCollections,
  close,
};