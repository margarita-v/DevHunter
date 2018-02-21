import pick from 'lodash/pick';
import User from '../../users';
import {checkCondition, returnData} from '../../../utils/common-utils';
import jwtService from '../../../services/jwt-service';
import UserService from '../../users/services';
import {CREATED_STATUS_CODE, NOT_FOUND_ERROR_CODE} from '../../../utils/status-codes';

/**
 * Controller for user's authorization
 */
export default {
    async signUp(ctx) {
        const userData = pick(ctx.request.body, User.createFields);
        const { _id } = await UserService.createUser(userData);
        const user = await UserService.getUserWithPublicFields({ _id });
        returnData(ctx, user, CREATED_STATUS_CODE);
    },
    async signIn(ctx) {
        const { email, password } = ctx.request.body;
        checkCondition(ctx, !email || !password, 'Invalid data');

        const user = await User.findOne({ email });
        checkCondition(ctx, !user, 'User not found', NOT_FOUND_ERROR_CODE);

        // Check user's password
        checkCondition(ctx, !user.comparePasswords(password), 'Invalid password');

        // Return generated token to the user
        const token = await jwtService.generateToken({ email });
        returnData(ctx, token);
    },
};
