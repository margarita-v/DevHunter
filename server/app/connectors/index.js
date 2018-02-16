import { MONGO_URI } from '../config';
import mongooseConnector from './mongoose-connector';

export {
    mongooseConnector,
};

export default function initConnectors() {
    mongooseConnector(MONGO_URI);
}


