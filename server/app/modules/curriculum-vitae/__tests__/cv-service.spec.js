import {closeAndDropDb, initAndDropDb} from '../../../utils/mongo-utils';
import {CREATE_CV_ERROR_MESSAGE, MAX_CV_COUNT} from '../services/cv-service';
import {createTestCV, createTestCvList, TEST_CV_DATA} from '../helpers/cv-helpers';
import {COMMON_REQUIRED_FIELDS, expectProperties} from '../../../helpers/test-helpers';
import AppError from '../../../helpers/error';
import {pick} from 'lodash';

global.AppError = AppError;

describe('CV Service test', () => {
    beforeAll(async () => await initAndDropDb());

    it('CV was created successfully', async () => {
        const cv = await createTestCV();
        const cvObject = cv.toObject();

        expect(pick(cvObject, Object.keys(TEST_CV_DATA))).toEqual(TEST_CV_DATA);
        expectProperties(cvObject, COMMON_REQUIRED_FIELDS);

        await cv.remove();
    });

    it(`User can not created over ${MAX_CV_COUNT} CVs`, async () => {
        await createTestCvList(MAX_CV_COUNT);

        try {
            await createTestCV();
        } catch (err) {
            expect(err.message).toBe(CREATE_CV_ERROR_MESSAGE);
        }
    });

    it('Invalid data for CV creation', async () => {
        try {
            await createTestCV({});
        } catch (err) {
            const { errors } = err.toJSON();
            expectProperties(errors, ['title', 'description', 'userHash', 'tags']);
        }
    });

    afterAll(async () => await closeAndDropDb());
});
