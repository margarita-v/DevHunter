import parseSearchQuery, {DEFAULT_FILTER} from '../helpers/parse-search-query';
import {MAX_COUNT_OF_RESPONSE_ITEMS} from '../constants/pagination';

describe('Tests for the function of parsing a query for search', () => {
    it('Correct parsing of query for search for invalid params', () => {
        const result = parseSearchQuery({ fakeParam: 'value' });
        expect(result).toEqual(DEFAULT_FILTER);
    });

    it('Correct parsing of valid query for search', () => {
        const size = MAX_COUNT_OF_RESPONSE_ITEMS - 1;
        const page = 50;
        const query = {
            title: 'Some title',
            tags: 'tag1,tag2',
            size,
            page,
        };
        const result = parseSearchQuery(query);
        expect(result).toEqual({
            ...query,
            tags: query.tags.split(','),
        });
    });

    it('Return default page number and size', () => {
        const result = parseSearchQuery({
            size: MAX_COUNT_OF_RESPONSE_ITEMS * 2,
            page: 'invalid',
        });
        expect(result).toEqual(DEFAULT_FILTER);
    });
});
