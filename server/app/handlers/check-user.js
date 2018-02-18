import { checkCondition } from '../utils/error-util';

const FORBIDDEN_ERROR_CODE = 403;

export default () => async (ctx, next) => {
    checkCondition(ctx, !ctx.user, 'Forbidden', FORBIDDEN_ERROR_CODE);
    await next();
};
