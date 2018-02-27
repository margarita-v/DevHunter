import {createTestCvFromDataArray} from '../modules/curriculum-vitae/helpers/cv-helpers';
import {createFakeCvDataList} from '../seeds/cv-seeds';
import {dropDb} from '../utils/mongo-utils';
import {DEFAULT_FILTER} from '../modules/curriculum-vitae/helpers/parse-search-query';
import server from '../server';
import request from 'supertest';
import {
    MAX_COUNT_OF_RESPONSE_ITEMS,
    PAGE_NUMBER,
} from '../modules/curriculum-vitae/constants/pagination';

const requestServer = request(server);

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

    afterAll(() => server.close());

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

    async function performGetRequest(route) {
        return await requestServer.get(route);
    }
});
