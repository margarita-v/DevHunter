import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

export default {
    /**
     * Function for a token generation
     */
    async generateToken(data) {
        // JWT function gets object of hashing and string for hashing
        return await jwt.sign(data, JWT_SECRET_KEY);
    },
    /**
     * Function for getting a user by its token
     */
    async verify(token) {
        return await jwt.verify(token, JWT_SECRET_KEY);
    },
};
