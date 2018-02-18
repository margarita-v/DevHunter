import jwtService from '../services/jwt-service';
import { User } from '../modules/users';
import { throwError } from '../utils/error-util';

const AUTH_ERROR_CODE = 401;

export default () => async (ctx, next) => {
    const { authorization } = ctx.headers;
    if (authorization) {
        try {
            const { email } = await jwtService.verify(authorization);
            ctx.user = await User.findOne({ email });
        } catch (err) {
            throwError(ctx, 'Invalid token', AUTH_ERROR_CODE);
        }
    }
    await next();
};
