import {checkCondition} from '../../../utils/common-utils';
import {FORBIDDEN_ERROR_CODE} from '../../../utils/status-codes';

/**
 * Function which checks if the context of function call contains
 * authorization token of the logged user
 */
export default function checkUser() {
    return async (ctx, next) => {
        checkCondition(ctx, !ctx.user, 'Forbidden', FORBIDDEN_ERROR_CODE);
        await next();
    };
}
