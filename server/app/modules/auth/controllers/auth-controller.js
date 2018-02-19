import pick from 'lodash/pick';
import User from '../../users';
import { checkCondition } from '../../../utils/error-util';
import jwtService from '../../../services/jwt-service';
import UserService from '../../users/services';
import {CREATED_STATUS_CODE} from '../../../utils/status-codes';

/**
 * Controller for user's authorization
 */
export default {
    async signUp(ctx) {
        const userData = pick(ctx.request.body, User.createFields);
        const { _id } = await UserService.createUser(userData);
        const user = await UserService.getUserWithPublicFields({ _id });
        ctx.status = CREATED_STATUS_CODE;
        ctx.body = { data: user };
    },
    async signIn(ctx) {
        const { email, password } = ctx.request.body;
        checkCondition(ctx, !email || !password, 'Invalid data');

        const user = await User.findOne({ email });
        checkCondition(ctx, !user, 'User not found');

        // Check user's password
        checkCondition(ctx, !user.comparePasswords(password), 'Invalid password');

        // Return generated token to the user
        const token = await jwtService.generateToken({ email });
        ctx.body = { data: token };
    },
};
