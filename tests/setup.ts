import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import connectDB from '../src/config/db';
import config from '../src/config/index';


beforeAll(async () => {

  if (config.env !== 'test' || !config.mongoURI?.includes('test')) {
    console.error('---------------------------------------------------------');
    console.error('ERROR: Attempting to run tests without a test database!');
    console.error('Current NODE_ENV:', config.env);
    console.error('Current Mongo URL:', config.mongoURI);
    console.error('Ensure NODE_ENV is set to "test" and MONGO_URI_TEST is configured.');
    console.error('---------------------------------------------------------');
    throw new Error('Test environment not configured correctly. Aborting tests.');
  }
  console.log(`Connecting to Test DB: ${config.mongoURI}`);
  await connectDB();
});

// Cleaning DB
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];

    await collection.deleteMany({});
  }
});

afterAll(async () => {

  await mongoose.disconnect();
  console.log('Disconnected from Test DB');
}); 