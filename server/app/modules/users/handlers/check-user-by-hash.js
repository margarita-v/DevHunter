import User from '../models';
import {checkCondition} from '../../../utils/common-utils';
import {NOT_FOUND_ERROR_CODE} from '../../../utils/status-codes';

export default function checkUserByHash() {
    return async (hash, ctx, next) => {
        const user = await User.findOne({ hash });
        checkCondition(ctx, !user, `User with hash ${hash} not found`, NOT_FOUND_ERROR_CODE);
        ctx.user = user;
        await next();
    };
}
