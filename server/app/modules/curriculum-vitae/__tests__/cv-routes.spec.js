import {closeAndDropDb, dropDb} from "../../../utils/mongo-utils";
import server from "../../../server";
import supertest from 'supertest';
import {DEFAULT_FILTER} from "../helpers/parse-search-query";
import {createTestCvFromDataArray} from "../helpers/test-helpers";
import {createFakeCvDataList} from "../../../seeds/cv-seeds";
import {MAX_COUNT_OF_RESPONSE_ITEMS} from "../constants/pagination";

const EMPTY_RESPONSE = {
    data: [],
    filter: DEFAULT_FILTER,
    cvCount: 0,
    pagesCount: 0,
};

const CUSTOM_RESPONSE_SIZE = 5;
const CV_COUNT_FOR_TEST = MAX_COUNT_OF_RESPONSE_ITEMS + CUSTOM_RESPONSE_SIZE;

describe('CV routes', () => {

    describe('CV searching', () => {

        const SEARCH_ROUTE = '/api/cv';

        it('Test for empty database', async () => {
            const response = await performGetRequest();
            expect(response.body).toEqual(EMPTY_RESPONSE);
        });

        describe('Test searching of generated data', () => {

            beforeAll(async () => {
                const cvDataArray = createFakeCvDataList(CV_COUNT_FOR_TEST);
                await createTestCvFromDataArray(cvDataArray);
            });

            it('Searching for all CV', async () => {
                const response = await performGetRequest();
                const { body: { filter, data, cvCount, pagesCount } } = response;
                expect(filter).toEqual(DEFAULT_FILTER);
                expect(cvCount).toEqual(CV_COUNT_FOR_TEST);
                expect(pagesCount).toEqual(2);
                expect(data).toHaveLength(MAX_COUNT_OF_RESPONSE_ITEMS);
            });

            it ('Searching for CV with a size param', async () => {
                const route = SEARCH_ROUTE + `?size=${CUSTOM_RESPONSE_SIZE}`;
                const response = await performGetRequest(route);
                const { body: { filter, data, } } = response;
                expect(filter.size).toEqual(CUSTOM_RESPONSE_SIZE);
                expect(data).toHaveLength(CUSTOM_RESPONSE_SIZE);
            });

            it('Searching for a CV with an invalid size param', async () => {
                const size = CV_COUNT_FOR_TEST * 2;
                const route = SEARCH_ROUTE + `?size=${size}`;
                const response = await performGetRequest(route);
                const { body: { filter, data, } } = response;
                expect(filter.size).toEqual(MAX_COUNT_OF_RESPONSE_ITEMS);
                expect(data).toHaveLength(MAX_COUNT_OF_RESPONSE_ITEMS);
            });

            it('Searching for a CV with a page param', async () => {
                const pageNumber = 2;
                const route = SEARCH_ROUTE + `?page=${pageNumber}`;
                const response = await performGetRequest(route);
                const { body: { filter, data } } = response;
                expect(filter.page).toEqual(pageNumber);
                expect(data).toHaveLength(CV_COUNT_FOR_TEST - MAX_COUNT_OF_RESPONSE_ITEMS);
            });

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
                    tags: ['javascript']
                }];
                await createTestCvFromDataArray(cvDataArray);
            });

            it('Searching by title', async () => {
                const searchedTitle = 'se';
                const route = SEARCH_ROUTE + `?title=${searchedTitle}`;
                const response = await performGetRequest(route);
                const { body: { filter, data, } } = response;
                expect(filter.title).toEqual(searchedTitle);
                expect(data).toHaveLength(2);
            });

            it('Searching by tags', async () => {
                const searchedTags = 'java,kotlin';
                const route = SEARCH_ROUTE + `?tags=${searchedTags}`;
                const response = await performGetRequest(route);
                const { body: { filter, data, } } = response;
                expect(filter.tags).toEqual(searchedTags.split(','));
                expect(data).toHaveLength(3);
            });

            afterAll(async () => await dropDb());
        });

        afterAll(async () => {
            await closeAndDropDb();
            await server.close();
        });

        async function performGetRequest(route = SEARCH_ROUTE) {
            return await supertest(server).get(route);
        }
    });
});
