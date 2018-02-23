import jwtService from '../services/jwt-service';
import {User} from '../modules/users';
import {throwError} from '../utils/common-utils';
import {AUTH_ERROR_CODE} from '../utils/status-codes';

/**
 * Function for user's verification by its token
 */
export default function verifyUser() {
    return async (ctx, next) => {
        const { authorization } = ctx.headers;
        if (authorization) {
            try {
                const { email } = await jwtService.verify(authorization);
                ctx.state.user = await User.findOne({ email });
            } catch (err) {
                throwError(ctx, 'Invalid token', AUTH_ERROR_CODE);
            }
        }
        await next();
    };
}
