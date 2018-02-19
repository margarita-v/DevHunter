import { checkCondition } from '../utils/error-util';
import {FORBIDDEN_ERROR_CODE} from '../utils/status-codes';

export default function checkUser() {
    return async (ctx, next) => {
        checkCondition(ctx, !ctx.user, 'Forbidden', FORBIDDEN_ERROR_CODE);
        await next();
    };
}
