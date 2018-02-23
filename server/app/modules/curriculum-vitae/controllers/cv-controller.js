import pick from 'lodash/pick';
import Cv from '../models';
import CvService from '../services';
import {checkCondition, returnData, returnResult} from '../../../utils/common-utils';
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
            userHash: ctx.state.user.hash,
        };

        const { _id } = await CvService.createCv(cvData);
        const cv = await Cv.findOne({ _id });
        returnData(ctx, cv, CREATED_STATUS_CODE);
    },

    /**
     * Function for getting a CV
     */
    async get(ctx) {
        const cvParams = await getCvParams(ctx);
        returnData(ctx, pick(cvParams.cv, Cv.createFields));
    },

    /**
     * Function for CV updating
     */
    async update(ctx) {
        const cvParams = await getCvParams(ctx);
        const newData = pick(cvParams.body, Cv.createFields);
        const updatedCv = await CvService.updateCv(newData, cvParams.cv);
        returnData(ctx, updatedCv);
    },

    /**
     * Function for CV removing
     */
    async delete(ctx) {
        const cvParams = await getCvParams(ctx);
        await cvParams.cv.remove();
        returnData(ctx, { hash: cvParams.hash });
    },

    /**
     * Function for searching of CVs
     */
    async search(ctx) {
        const MAX_COUNT_OF_RESPONSE_ITEMS = 20;
        const PAGE_NUMBER = 1;
        const queryParams = pick(ctx.request.query, Cv.searchFields);
        const filter = {
            title: queryParams.title ? queryParams.title : '',
            tags: queryParams.tags ? queryParams.tags.split(',') : [],
            size: parseInt(queryParams.size),
            page: parseInt(queryParams.page),
        };

        if (!filter.size || filter.size > MAX_COUNT_OF_RESPONSE_ITEMS) {
            filter.size = MAX_COUNT_OF_RESPONSE_ITEMS;
        }

        if (!filter.page) {
            filter.page = PAGE_NUMBER;
        }

        const { cvList, ...rest } = await CvService.search(filter);
        returnResult(ctx, { data: cvList, filter, ...rest });
    },
};

/**
 * Function for getting CV params by id with checking for its owner
 */
async function getCvParams(ctx) {
    const {
        params: {
            hash,
        },
        request: {
            body,
        },
        state: {
            user: {
                hash: userHash,
            },
        },
    } = ctx;

    const cv = await Cv.findOne({ hash });
    const cvString = `CV with hash ${ hash }`;
    checkCondition(ctx, !cv, `${ cvString } not found`, NOT_FOUND_ERROR_CODE);

    // Check if the CV belongs to the current user.
    checkCondition(
        ctx,
        cv.userHash !== userHash,
        `${ cvString } not belongs to user ${userHash}`,
        FORBIDDEN_ERROR_CODE);

    return { cv, body, hash, userHash };
}
