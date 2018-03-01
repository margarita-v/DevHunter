import {createTestCvFromDataArray, TEST_CV_DATA} from '../modules/curriculum-vitae/helpers/cv-helpers';
import {createFakeCvDataList} from '../seeds/cv-seeds';
import {expectProperties} from '../helpers/test-helpers';
import {dropDb} from '../utils/mongo-utils';
import {DEFAULT_FILTER} from '../modules/curriculum-vitae/helpers/parse-search-query';
import {TEST_USER_DATA} from '../modules/users/helpers/user-helpers';
import {User} from '../modules/users';
import request from 'supertest';
import server from '../server';
import {
    AUTH_ERROR_CODE,
    CREATED_STATUS_CODE,
    DEFAULT_ERROR_CODE, FORBIDDEN_ERROR_CODE,
    NOT_FOUND_ERROR_CODE,
    OK_STATUS_CODE,
} from '../constants/status-codes';
import {
    MAX_COUNT_OF_RESPONSE_ITEMS,
    PAGE_NUMBER,
} from '../modules/curriculum-vitae/constants/pagination';
import {MAX_CV_COUNT} from '../modules/curriculum-vitae/services/cv-service';

const requestServer = request(server);

const SIGN_UP_ROUTE = '/api/auth/signup';
const SIGN_IN_ROUTE = '/api/auth/signin';
const USERS_ROUTE = '/api/users';
const CV_ROUTE = '/api/cv';

const { email, password } = TEST_USER_DATA;
const DEFAULT_USER = { email, password };
const AUTHORIZATION = 'Authorization';

describe('Auth test', () => {
    describe('Sign up test', () => {
        it('User signed up successfully',
            (done) => signUp().expect(CREATED_STATUS_CODE, done));

        it('Test sign up for an invalid data',
            (done) => postAndCheck(SIGN_UP_ROUTE, {}, DEFAULT_ERROR_CODE, (res) => {
                expectProperties(res.body.errors, User.createFields);
                done();
            })
        );

        afterAll(async () => await dropDb());
    });

    describe('Sign in test', () => {
        it('User signed in successfully', async (done) => {
            await signUp();
            postAndCheck(SIGN_IN_ROUTE, DEFAULT_USER, OK_STATUS_CODE, (res) => {
                expect(res.body).toHaveProperty('data');
                done();
            });
        });

        it('Test for sign in for an invalid data',
            (done) => testSignIn({}, DEFAULT_ERROR_CODE, done));

        it('Try to sign in with an invalid password', async (done) => {
            await signUp();
            testSignIn({ email, password: 'invalid-password' }, DEFAULT_ERROR_CODE, done);
        });

        it('Try to sign in with unknown email',
            (done) => testSignIn({email: 'another-email', password}, NOT_FOUND_ERROR_CODE, done));

        afterAll(async () => await dropDb());
    });
});

describe('Tests for CV and user controllers', () => {
    let userHash, cvHash, cvData, token, invalidToken;

    beforeAll(async () => {
        const signUpResult = await signUp();
        const signInResult = await signIn();

        const { hash } = signUpResult.body.data;
        const { data } = signInResult.body;

        userHash = hash;
        token = data;
        invalidToken = token + '1';

        cvData = TEST_CV_DATA;
        cvData.userHash = userHash;
    });

    describe('CV creation', () => {
        it('CV was created successfully',
            (done) => createCv(token, CREATED_STATUS_CODE, (res) => {
                const { hash } = res.body.data;
                cvHash = hash;
                done();
            })
        );

        it('Unable to create a CV without user\'s token',
            (done) => postAndCheck(CV_ROUTE, cvData, FORBIDDEN_ERROR_CODE, () => done())
        );

        it('Unable to create a CV with an invalid token',
            (done) => createCv(invalidToken, AUTH_ERROR_CODE, () => done())
        );
    });

    describe('CV deleting', () => {
        it('CV was deleted successfully',
            (done) => deleteCv(cvHash)
                .set(AUTHORIZATION, token)
                .expect(OK_STATUS_CODE, done));

        it('Unable to delete a CV without user\'s token',
            (done) => deleteCv(cvHash).expect(FORBIDDEN_ERROR_CODE, done));
    });

    describe('Get all CV for the current user', () => {
        it('All CV were get successfully', async () => {
           for (let i = 0; i < MAX_CV_COUNT; i++) {
               await postDataWithToken(CV_ROUTE, cvData, token);
           }
           const response = await performGetRequest(USERS_ROUTE + '/' + userHash + '/all-cv');
           const { body: { data } } = response;
           expect(data).toHaveLength(MAX_CV_COUNT);
        });
    });

    afterAll(async () => await dropDb());

    function createCv(token, responseCode, done) {
        return postAndCheckWithToken(CV_ROUTE, cvData, token, responseCode, done);
    }
});

describe('CV searching', () => {
    const EMPTY_RESPONSE = {
        data: [],
        filter: DEFAULT_FILTER,
        cvCount: 0,
        pagesCount: 0,
        page: PAGE_NUMBER,
    };

    const CUSTOM_RESPONSE_SIZE = 5;
    const CV_COUNT_FOR_TEST = MAX_COUNT_OF_RESPONSE_ITEMS + CUSTOM_RESPONSE_SIZE;

    it('Test for empty database', async () => {
        const response = await performGetRequest(CV_ROUTE);
        expect(response.body).toEqual(EMPTY_RESPONSE);
    });

    describe('Test searching of generated data', () => {
        beforeAll(async () => {
            const cvDataArray = createFakeCvDataList(CV_COUNT_FOR_TEST);
            await createTestCvFromDataArray(cvDataArray);
        });

        it('Searching for all CV', async () => {
            const { filter, cvCount, pagesCount } = await getResponseFields();
            expect(filter).toEqual(DEFAULT_FILTER);
            expect(cvCount).toEqual(CV_COUNT_FOR_TEST);
            expect(pagesCount).toEqual(2);
        });

        it('Searching for CV with a size param',
            async () => await testForSize(CUSTOM_RESPONSE_SIZE));

        it('Searching for a CV with an invalid size param',
            async () => await testForSize(CV_COUNT_FOR_TEST * 2, MAX_COUNT_OF_RESPONSE_ITEMS));

        it('Searching for a CV with a page param',
            async () => await testForPageNumber(2));

        it('Searching for a CV with an invalid page param',
            async () => await testForPageNumber(10));

        /**
         * Helpful function for testing requests with a size param
         */
        async function testForSize(requestSize, responseSize = requestSize) {
            const sizeParam = `?size=${requestSize}`;
            const { filter } = await getResponseFields(sizeParam, responseSize);
            const expectedFilterSize = requestSize < MAX_COUNT_OF_RESPONSE_ITEMS
                ? requestSize
                : MAX_COUNT_OF_RESPONSE_ITEMS;
            expect(filter.size).toEqual(expectedFilterSize);
        }

        /**
         * Helpful function for testing requests with a page param
         */
        async function testForPageNumber(requestPage) {
            const pageParam = `?page=${requestPage}`;
            const dataLength = CV_COUNT_FOR_TEST - MAX_COUNT_OF_RESPONSE_ITEMS;
            const { filter, pagesCount, page } =
                await getResponseFields(pageParam, dataLength);

            const expectedFilterPage = page <= pagesCount ? page : pagesCount;
            expect(filter.page).toEqual(requestPage);
            expect(page).toEqual(expectedFilterPage);
        }

        afterAll(async () => await dropDb());
    });

    describe('Test searching of a concrete data', () => {
        beforeAll(async () => {
            const description = 'description';
            const cvDataArray = [{
                userHash: 1,
                title: 'Senior Android developer',
                description: description,
                tags: ['java', 'kotlin'],
            }, {
                userHash: 2,
                title: 'Middle Android developer',
                description: description,
                tags: ['kotlin'],
            }, {
                userHash: 3,
                title: 'Senior backend developer',
                description: description,
                tags: ['java', 'linux'],
            }, {
                userHash: 4,
                title: 'Middle frontend developer',
                description: description,
                tags: ['javascript'],
            }];

            await createTestCvFromDataArray(cvDataArray);
        });

        it('Searching by title', async () => {
            const searchedTitle = 'se';
            const { filter } = await getResponseFields(`?title=${searchedTitle}`, 2);
            expect(filter.title).toEqual(searchedTitle);
        });

        it('Searching by tags', async () => {
            const searchedTags = 'java,kotlin';
            const { filter } = await getResponseFields(`?tags=${searchedTags}`, 3);
            expect(filter.tags).toEqual(searchedTags.split(','));
        });

        afterAll(async () => await dropDb());
    });

    async function getResponseFields(routeParams = CV_ROUTE,
                                     dataLength = MAX_COUNT_OF_RESPONSE_ITEMS) {
        const route = routeParams !== CV_ROUTE
            ? CV_ROUTE + routeParams
            : CV_ROUTE;
        const response = await performGetRequest(route);
        const { body: { filter, data, cvCount, pagesCount, page } } = response;
        expect(data).toHaveLength(dataLength);
        return { filter, cvCount, pagesCount, page };
    }
});

afterAll(() => server.close());

// region User's authorization
function signUp() {
    return postData(SIGN_UP_ROUTE, TEST_USER_DATA);
}

function signIn() {
    return postData(SIGN_IN_ROUTE, DEFAULT_USER);
}

function testSignIn(data, responseCode, done) {
    return postData(SIGN_IN_ROUTE, data).expect(responseCode, done);
}
// endregion

// region HTTP requests
function performGetRequest(route) {
    return requestServer.get(route);
}

function deleteCv(cvHash) {
    return requestServer.delete(CV_ROUTE + '/' + cvHash);
}

function postData(route, data) {
    return requestServer.post(route).send(data);
}

function postDataWithToken(route, data, token) {
    return postData(route, data)
        .set(AUTHORIZATION, token);
}
// endregion

function postAndCheck(route, data, responseCode, end) {
    return postData(route, data)
        .expect(responseCode)
        .end((err, res) => end(res));
}

function postAndCheckWithToken(route, data, token, responseCode, end) {
    return postDataWithToken(route, data, token)
        .expect(responseCode)
        .end((err, res) => end(res));
}
