import {closeAndDropDb, initAndDropDb} from '../utils/mongo-utils';
import {createTestUser} from '../modules/users/helpers/user-helpers';
import {Cv} from '../modules/curriculum-vitae';
import {User} from '../modules/users';
import {pick} from 'lodash';
import {COMMON_REQUIRED_FIELDS, expectProperties} from '../helpers/test-helpers';
import {
    createTestCV,
    createTestCvList,
    TEST_CV_DATA,
} from '../modules/curriculum-vitae/helpers/cv-helpers';
import {
    CREATE_CV_ERROR_MESSAGE,
    MAX_CV_COUNT,
} from '../modules/curriculum-vitae/services/cv-service';

describe('Tests for all services', () => {
    beforeAll(async () => await initAndDropDb());

    describe('Tests for CV Service', () => {
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
                expectProperties(errors, Cv.requiredFields);
            }
        });
    });

    describe('Tests for user service', () => {
        it('User was created successfully', async () => {
            const user = await createTestUser();
            const userObject = user.toObject();

            expectProperties(userObject, COMMON_REQUIRED_FIELDS);
            await user.remove();
        });

        it('Invalid data for a user creation', async () => {
            try {
                await createTestUser({});
            } catch (err) {
                expectProperties(err.errors, User.createFields);
            }
        });
    });

    afterAll(async () => await closeAndDropDb());
});
