import {Cv} from '../../curriculum-vitae';
import UserService from '../services';
import {returnData} from '../../../utils/common-utils';

/**
 * Controller for getting users
 */
export default {

    /**
     * Function for getting the current logged user
     */
    async getCurrentUser(ctx) {
        const { user: { _id } } = ctx;
        const user = await UserService.getUserWithPublicFields({ _id });
        returnData(ctx, user);
    },

    /**
     * Function for getting of all CVs by its owner's hash
     */
    async getAllCvByUserHash(ctx) {
        const { user: { hash: userHash }} = ctx;
        const cvList = await Cv.find({ userHash });
        returnData(ctx, cvList);
    },
};
