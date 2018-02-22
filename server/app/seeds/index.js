import { MONGO_URI } from '../config';
import mongoose from 'mongoose';
import mongooseConnector from '../connectors/mongoose-connector';
import createFakeUsers from './user-seeds';
import createFakeCv from './cv-seeds';

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

    try {
        // Create fake users
        console.log('Creation of fake users was started...');
        const users = await createFakeUsers();
        console.log(`${users.length} users were created.`);

        // Create CVs for all users
        console.log('Creation of fake CVs was started...');
        const cvs = await createFakeCv(users);
        console.log(`${cvs.length} CVs were created.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoConnection.close();
    }
}
