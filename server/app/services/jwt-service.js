import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

export default {
    /**
     * Function for a token generation
     */
    generateToken(data) {
        // JWT function gets object of hashing and string for hashing
        return jwt.sign(data, JWT_SECRET_KEY);
    },
    /**
     * Function for getting a user by its token
     */
    verify(token) {
        return jwt.verify(token, JWT_SECRET_KEY);
    },
};
