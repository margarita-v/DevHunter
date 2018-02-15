import mongoose from 'mongoose';

mongoose.Promise = Promise;

export default (mongoUri) => {
    if (!mongoUri) {
        throw Error('Mongo URI is undefined');
    }

    // Use promises because Mongo connection is synchronous
    return new Promise((res, rej) => {
        mongoose
            .connect(mongoUri)
            .then((mongoDb) => {
                res(mongoDb);
                console.log('Mongo connected');
            })
            .catch((err) => {
                rej(err);
            });
    });
};