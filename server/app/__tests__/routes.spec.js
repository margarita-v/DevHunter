import {createTestCvFromDataArray} from '../modules/curriculum-vitae/helpers/cv-helpers';
import {createFakeCvDataList} from '../seeds/cv-seeds';
import {expectProperties} from '../helpers/test-helpers';
import {dropDb} from '../utils/mongo-utils';
import {DEFAULT_FILTER} from '../modules/curriculum-vitae/helpers/parse-search-query';
import {TEST_USER_DATA} from '../modules/users/helpers/user-helpers';
import {User} from '../modules/users';
import server from '../server';
import request from 'supertest';
import {
    MAX_COUNT_OF_RESPONSE_ITEMS,
    PAGE_NUMBER,
} from '../modules/curriculum-vitae/constants/pagination';
import {
    CREATED_STATUS_CODE,
    DEFAULT_ERROR_CODE,
    NOT_FOUND_ERROR_CODE,
    OK_STATUS_CODE,
} from '../constants/status-codes';

describe('Routes testing', () => {
    const requestServer = request(server);

    describe('Auth test', () => {
        const SIGN_UP_ROUTE = '/api/auth/signup';
        const SIGN_IN_ROUTE = '/api/auth/signin';

        const { email, password } = TEST_USER_DATA;

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
                postAndCheck(SIGN_IN_ROUTE, { email, password }, OK_STATUS_CODE, (res) => {
                    expect(res.body).toHaveProperty('data');
                    done();
                });
            });

            it('Test for sign in for an invalid data',
                (done) => signIn({}, DEFAULT_ERROR_CODE, done));

            it('Try to sign in with an invalid password', async (done) => {
                await signUp();
                signIn({ email, password: 'invalid-password' }, DEFAULT_ERROR_CODE, done);
            });

            it('Try to sign in with unknown email',
                (done) => signIn({email: 'another-email', password}, NOT_FOUND_ERROR_CODE, done));

            afterAll(async () => await dropDb());
        });

        function signUp() {
            return postData(SIGN_UP_ROUTE, TEST_USER_DATA);
        }

        function signIn(data, responseCode, done) {
            return postData(SIGN_IN_ROUTE, data).expect(responseCode, done);
        }

        function postAndCheck(route, data, responseCode, end) {
            return postData(route, data)
                .expect(responseCode)
                .end((err, res) => end(res));
        }
    });

    describe('CV searching', () => {
        const SEARCH_ROUTE = '/api/cv';

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
            const response = await performGetRequest(SEARCH_ROUTE);
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

        async function getResponseFields(routeParams = SEARCH_ROUTE,
                                         dataLength = MAX_COUNT_OF_RESPONSE_ITEMS) {
            const route = routeParams !== SEARCH_ROUTE
                ? SEARCH_ROUTE + routeParams
                : SEARCH_ROUTE;
            const response = await performGetRequest(route);
            const { body: { filter, data, cvCount, pagesCount, page } } = response;
            expect(data).toHaveLength(dataLength);
            return { filter, cvCount, pagesCount, page };
        }
    });

    afterAll(async () => await server.close());

    function postData(route, data) {
        return requestServer.post(route).send(data);
    }

    async function performGetRequest(route) {
        return await requestServer.get(route);
    }
});
