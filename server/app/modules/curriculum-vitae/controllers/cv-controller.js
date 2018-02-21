import pick from 'lodash/pick';
import Cv from '../models';
import CvService from '../services';
import {checkCondition, returnData} from '../../../utils/common-utils';
import {
    CREATED_STATUS_CODE,
    FORBIDDEN_ERROR_CODE,
    NOT_FOUND_ERROR_CODE,
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

        const { _id } = await CvService.createCv(cvData);
        const cv = await Cv.findOne({ _id });
        returnData(ctx, cv, CREATED_STATUS_CODE);
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

        const cv = await getCv(ctx, _id, userId);
        const newData = pick(body, Cv.createFields);
        const updatedCv = await CvService.updateCv(newData, cv);
        returnData(ctx, updatedCv);
    },

    /**
     * Function for CV removing
     */
    async delete(ctx) {
        const {
            params: {
                id: _id,
            },
            user: {
                _id: userId,
            },
        } = ctx;

        const cv = await getCv(ctx, _id, userId);
        await cv.remove();
        returnData(ctx, { id: _id });
    },
};

/**
 * Function for getting CV by id with checking for its owner
 */
async function getCv(ctx, _id, userId) {
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

    return cv;
}
