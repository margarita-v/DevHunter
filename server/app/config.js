import config from 'config';
import dotenv from 'dotenv';
import envs from './constants/envs';
import env, {IS_TEST} from './utils/env';

if (!IS_TEST) {
    dotenv.config();
}

// Check if the given environment does not exist
if (!envs[env]) {
    throw Error(`Unknown env ${env}`);
}

// Get values from the environment variable or get default values
const PORT = process.env.PORT || config.get('port');
const MONGO_URI = process.env.MONGO_URI || config.get('mongo.uri');
const JWT_SECRET_KEY = config.get('jwt.secretKey');

if (!JWT_SECRET_KEY) {
    throw Error('JWT secret key not found');
}

export {
    PORT,
    MONGO_URI,
    JWT_SECRET_KEY,
};
