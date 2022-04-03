/**
 * Demo
 */

import { MongoClient } from 'mongodb';

export async function listDatabases(client: MongoClient) {
  const databasesList = await client.db().admin().listDatabases();

  console.log('Databases');

  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
}