import pick from 'lodash/pick';
import { User } from '../../users';
import { checkCondition } from '../../../utils/error-util';
import jwtService from '../../../services/jwt-service';

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

        // Return generated token to the user
        const token = await jwtService.generateToken({ email });
        ctx.body = { data: token };
    },
};
