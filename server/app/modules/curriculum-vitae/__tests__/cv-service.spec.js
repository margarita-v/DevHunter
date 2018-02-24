import pick from 'lodash/pick';
import CvService from '../services';
import {closeDbConnection, dropDb, initDbConnection} from "../../../utils/mongo-utils";
import {CREATE_CV_ERROR_MESSAGE, MAX_CV_COUNT} from "../services/cv-service";
import AppError from "../../../helpers/error";

global.AppError = AppError;

const TEST_CV_DATA = {
    userHash: 'user-hash',
    title: 'Android developer',
    description: 'Mobile development',
    tags: ['java', 'kotlin'],
};

describe('CV Service test', () => {
    beforeAll(async () => {
        await initDbConnection();
        await dropDb();
    });

    it('CV was created successfully', async () => {
        const cv = await createCV();
        const cvObject = cv.toObject();

        expect(pick(cvObject, Object.keys(TEST_CV_DATA))).toEqual(TEST_CV_DATA);
        expectProperties(cvObject, ['hash', 'createdAt', 'updatedAt']);

        await cv.remove();
    });

    it(`User can not created over ${MAX_CV_COUNT} CVs`, async () => {
        for (let i = 0; i < MAX_CV_COUNT; i++) {
            await createCV();
        }
        try {
            await createCV();
        } catch (err) {
            expect(err.message).toBe(CREATE_CV_ERROR_MESSAGE);
        }
    });

    it('Invalid data for CV creation', async () => {
        try {
            await createCV({});
        } catch (err) {
            const { errors } = err.toJSON();
            expectProperties(errors, ['title', 'description', 'userHash', 'tags']);
        }
    });

    afterAll(async () => {
        await dropDb();
        await closeDbConnection();
    });
});

/**
 * Helpful function which checks if the object has a properties which passed to args
 */
function expectProperties(object, props) {
    props.forEach((prop) => expect(object).toHaveProperty(prop));
}

/**
 * Function for creation of CV
 */
async function createCV(cvData = TEST_CV_DATA) {
    return await CvService.createCv(cvData);
}
