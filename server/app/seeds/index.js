import { MONGO_URI } from "../config";
import mongoose from 'mongoose';
import mongooseConnector from "../connectors/mongoose-connector";

initSeeds();

/**
 * Function for performing connection to the MongoDb and creation of seeds
 */
async function initSeeds() {
    await mongooseConnector(MONGO_URI);
    mongoose.connection.close();
}