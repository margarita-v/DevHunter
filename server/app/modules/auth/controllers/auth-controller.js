import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import { User } from '../../users';
import { JWT_SECRET_KEY } from '../../../config';

const ERROR_CODE = 400;

/**
 * Function which checks a condition and throws error if condition is false
 * @param ctx Context of function'c call
 * @param condition Condition which will be checked
 * @param message Error message
 */
function checkCondition(ctx, condition, message) {
    if (condition) {
        ctx.throw(ERROR_CODE, { message: message });
    }
}

export default {
    async signUp(ctx) {
        const { _id } = await User.create(pick(ctx.request.body, User.createFields));
        const user = await User.findOneWithPublicFields({ _id });

        ctx.body = { data: user };
    },
    async signIn(ctx) {
        const { email, password } = ctx.request.body;
        checkCondition(ctx, !email || !password, 'Invalid data');

        const user = await User.findOne({ email });
        checkCondition(ctx, !user, 'User not found');

        // Check user's password
        checkCondition(ctx, !user.comparePasswords(password), 'Invalid password');

        // Generate token.
        // JWT function gets object of hashing and string for hashing
        const token = await jwt.sign({ email }, JWT_SECRET_KEY);

        // Return token to the user
        ctx.body = { data: token };
    },
};
