import mongoose from 'mongoose';

mongoose.Promise = Promise;

/**
 * Function for configuration of connection to the MongoDb
 */
export default function mongooseConnector(mongoUri) {
    if (!mongoUri) {
        throw Error('Mongo URI is undefined');
    }

    // Use promises because Mongo connection is synchronous
    return mongoose
        .connect(mongoUri)
        .then(() => {
        console.log('Mongo connected');
    });
}
