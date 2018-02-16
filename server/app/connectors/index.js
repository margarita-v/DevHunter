import { MONGO_URI } from '../config';
import mongooseConnector from './mongoose-connector';
import server from "../server";

export {
    mongooseConnector,
};

export default async function initConnectors() {
    try {
        await mongooseConnector(MONGO_URI);
    } catch (err) {
        server.close();
        console.log(err);
    }
}


