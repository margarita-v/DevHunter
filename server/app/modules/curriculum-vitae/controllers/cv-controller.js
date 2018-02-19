import pick from 'lodash/pick';
import Cv from '../models';
import CvService from '../services';
import { throwError } from '../../../utils/error-util';
import {CREATED_STATUS_CODE} from '../../../utils/status-codes';

/**
 * Controller for CV creation
 */
export default {
    async create(ctx) {
        const cvData = {
            ...pick(ctx.request.body, Cv.createFields),
            userId: ctx.user._id,
        };
        try {
            const {_id} = await CvService.createCv(cvData);
            const cv = await Cv.findOne({_id});
            ctx.status = CREATED_STATUS_CODE;
            ctx.body = {data: cv};
        } catch (err) {
            throwError(ctx, err.message);
        }
    },
};
