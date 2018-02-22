import UserService from '../services';
import {returnData} from '../../../utils/common-utils';

/**
 * Controller for getting users
 */
export default {
    async getCurrentUser(ctx) {
        const { user: { _id } } = ctx;
        const user = await UserService.getUserWithPublicFields({ _id });
        returnData(ctx, user);
    },
};
