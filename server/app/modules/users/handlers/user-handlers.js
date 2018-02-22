import User from '../models';
import {checkCondition} from '../../../utils/common-utils';
import {FORBIDDEN_ERROR_CODE, NOT_FOUND_ERROR_CODE} from '../../../utils/status-codes';

/**
 * Function which checks if the context of function call contains
 * authorization token of the logged user
 */
function checkUser() {
    return async (ctx, next) => {
        checkCondition(ctx, !ctx.user, 'Forbidden', FORBIDDEN_ERROR_CODE);
        await next();
    };
}

/**
 * Function for searching the user by its hash
 */
function findUserByHash() {
    return async (hash, ctx, next) => {
        const user = await User.findOne({ hash });
        checkCondition(ctx, !user, `User with hash ${hash} not found`, NOT_FOUND_ERROR_CODE);
        ctx.user = user;
        await next();
    };
}

export {
    checkUser,
    findUserByHash,
};
