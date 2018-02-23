import {Cv} from '../../curriculum-vitae';
import {returnData} from '../../../utils/common-utils';

/**
 * Controller for getting users
 */
export default {

    /**
     * Function for getting of all CVs by its owner's hash
     */
    async getAllCvByUserHash(ctx) {
        const {
            state: {
                user: {
                    hash: userHash,
                },
            },
        } = ctx;
        const cvList = await Cv.find({ userHash });
        returnData(ctx, cvList);
    },
};
