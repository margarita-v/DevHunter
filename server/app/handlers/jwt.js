import jwtService from '../services/jwt-service';
import { User } from '../modules/users';

const AUTH_ERROR_CODE = 401;

export default () => async (ctx, next) => {
    const { authorization } = ctx.headers;
    if (authorization) {
        try {
            const { email } = await jwtService.verify(authorization);
            ctx.user = await User.findOne({ email });
        } catch (err) {
            ctx.throw(AUTH_ERROR_CODE, { message: 'Invalid token' });
        }
    }
    await next();
};
