import mongoose from 'mongoose';

mongoose.Promise = Promise;

export default (mongoUri) => {
    if (!mongoUri) {
        throw Error('Mongo URI is undefined');
    }

    // Use promises because Mongo connection is synchronous
    return mongoose
        .connect(mongoUri)
        .then(() => {
 console.log('Mongo connected');
});
};
