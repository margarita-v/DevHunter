import {MAX_COUNT_OF_RESPONSE_ITEMS, PAGE_NUMBER} from '../constants/pagination';

/**
 * Function which returns a correct filter for searching of CV
 */
export default function parseSearchQuery(queryParams) {
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

    return filter;
}
