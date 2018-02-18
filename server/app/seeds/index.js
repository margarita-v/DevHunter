import { MONGO_URI } from '../config';
import mongoose from 'mongoose';
import mongooseConnector from '../connectors/mongoose-connector';
import createFakeUsers from './user-seeds';

initSeeds();

/**
 * Function for performing connection to the MongoDb and creation of seeds
 */
async function initSeeds() {
    // Init connection to the database
    await mongooseConnector(MONGO_URI);

    // Drop all data
    const mongoConnection = mongoose.connection;
    await mongoConnection.dropDatabase();

    // Create fake users and close database connection
    const users = await createFakeUsers();
    console.log(users);
    mongoConnection.close();
}
