import mongoose from 'mongoose';
import {MONGO_URI} from "../config";
import mongooseConnector from "../connectors/mongoose-connector";

function initDbConnection() {
    return mongooseConnector(MONGO_URI);
}

function closeDbConnection() {
    return mongoose.connection.close();
}

function dropDb() {
    return mongoose.connection.db.dropDatabase();
}

async function closeAndDropDb() {
    await dropDb();
    await closeDbConnection();
}

export {
    initDbConnection,
    closeDbConnection,
    dropDb,
    closeAndDropDb,
};
