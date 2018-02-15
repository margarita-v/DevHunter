import config from 'config';
import envs from './constants/envs';
import env from './utils/env';

// Check if the given environment does not exist
if (!envs[env]) {
    throw Error(`Unknown env ${env}`);
}

// Get values from the environment variable or get default values
const PORT = process.env.PORT || config.get('port');
const MONGO_URI = process.env.MONGO_URI || config.get('mongo.uri');

export {
    PORT,
    MONGO_URI
};