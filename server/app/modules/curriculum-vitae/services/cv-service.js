import Cv from '../models';
import AppError from '../../../helpers/error';

/**
 * Max count of CVs for the one user
 */
export const MAX_CV_COUNT = 3;

export const CREATE_CV_ERROR_MESSAGE = `User can not create over ${MAX_CV_COUNT} CVs`;

/**
 * Service with common functions for CVs
 */
export default {

    /**
     * Function for creation of CV
     */
    async createCv(data) {
        // For getting a count of the current user's CVs
        const { userHash } = data;
        const cvCount = await Cv.count({ userHash });
        if (cvCount === MAX_CV_COUNT) {
            throw new AppError({ message: CREATE_CV_ERROR_MESSAGE });
        }
        return Cv.create(data);
    },

    /**
     * Function for updating of CV
     */
    updateCv(data, cv) {
        cv.set(data);
        try {
            return cv.save();
        } catch (err) {
            throw new AppError({ ...err });
        }
    },

    /**
     * Function for searching of CVs
     */
    async search({ title, tags, size, page }) {
        const query = {
            title: {
                // For performing a case insensitive searching
                $regex: new RegExp(title, 'ig'),
            },
        };
        const sortObject = { updatedAt: '-1' };

        if (tags.length) {
            query.tags = { $in: tags };
        }

        // Count of all CVs for the current query
        const cvCount = await Cv
            .count(query)
            .sort(sortObject);
        const pagesCount = Math.ceil(cvCount / size);

        if (pagesCount > 0 && page > pagesCount) {
            page = pagesCount;
        }

        // List of response items
        const cvList = await Cv
            .find(query)
            .sort(sortObject)
            // Count of items which will be get from the database
            .limit(size)
            .skip((page - 1) * size);

        return { cvList, cvCount, pagesCount, page };
    },
};
