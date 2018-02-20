import pick from 'lodash/pick';
import Cv from '../models';
import CvService from '../services';
import {checkCondition, throwError} from '../../../utils/error-util';
import {
    CREATED_STATUS_CODE,
    FORBIDDEN_ERROR_CODE,
    NOT_FOUND_ERROR_CODE,
    UPDATED_STATUS_CODE,
} from '../../../utils/status-codes';

/**
 * Controller for CV manipulation
 */
export default {

    /**
     * Function for CV creation
     */
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

    /**
     * Function for CV updating
     */
    async update(ctx) {
        const {
            params: {
                id: _id,
            },
            request: {
                body,
            },
            user: {
                _id: userId,
            },
        } = ctx;

        const cv = await Cv.findOne({ _id });
        const cvString = `CV with id ${_id}`;
        checkCondition(ctx, !cv, `${cvString} not found`, NOT_FOUND_ERROR_CODE);

        // Check if the CV belongs to the current user.
        // We should convert userId to Hex string because it is a mongoose object (object id)
        checkCondition(
            ctx,
            cv.userId !== userId.toHexString(),
            `${cvString} not belongs to user ${userId}`,
            FORBIDDEN_ERROR_CODE);

        const newData = pick(body, Cv.createFields);
        const updatedCv = await CvService.updateCv(newData, cv);

        ctx.status = UPDATED_STATUS_CODE;
        ctx.body = { data: updatedCv };
    },
};
