import {closeAndDropDb} from "../../../utils/mongo-utils";
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
                let response = await performGetRequest();
                const { body: { filter, data, cvCount, } } = response;
                expect(filter).toEqual(DEFAULT_FILTER);
                expect(cvCount).toEqual(CV_COUNT_FOR_TEST);
                expect(data).toHaveLength(MAX_COUNT_OF_RESPONSE_ITEMS);
            });

            it ('Searching for CV with a size param', async () => {
                const route = SEARCH_ROUTE + `?size=${CUSTOM_RESPONSE_SIZE}`;
                const response = await performGetRequest(route);
                const { body: { filter, data, } } = response;
                expect(filter.size).toEqual(CUSTOM_RESPONSE_SIZE);
                expect(data).toHaveLength(CUSTOM_RESPONSE_SIZE);
            });

            afterAll(async () => await closeAndDropDb())
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
